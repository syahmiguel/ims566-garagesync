document.addEventListener("DOMContentLoaded", () => {
  initAuthPage();
  guardProtectedPages();
  initDashboardPage();
  initJobsPage();
  initInventoryPage();
});

/* ---------- 1. AUTHENTICATION ---------- */
function getUsers() {
  const stored = localStorage.getItem("garagesync_users");
  return stored ? JSON.parse(stored) : DEFAULT_USERS;
}

function initAuthPage() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const fillDemoBtn = document.getElementById("fillDemoBtn");

  if (!loginForm) return;

  fillDemoBtn?.addEventListener("click", () => {
    document.getElementById("loginUsername").value = "admin";
    document.getElementById("loginPassword").value = "ims566";
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!username || !password) {
      showAuthAlert("Please enter both username and password.", "danger");
      return;
    }

    const matchedUser = getUsers().find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (!matchedUser) {
      showAuthAlert("Invalid credentials. Use admin / ims566.", "danger");
      return;
    }

    localStorage.setItem("garagesync_session", JSON.stringify(matchedUser));
    showAuthAlert("Login successful! Redirecting...", "success");
    setTimeout(() => { window.location.href = "dashboard.html"; }, 500);
  });

  registerForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fullName = document.getElementById("regFullName").value.trim();
    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    if (!fullName || !username || password.length < 6) {
      showAuthAlert("All fields required (password min 6 chars).", "danger");
      return;
    }

    const users = getUsers();
    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      showAuthAlert("Username already exists.", "warning");
      return;
    }

    users.push({ username, password, fullName });
    localStorage.setItem("garagesync_users", JSON.stringify(users));
    showAuthAlert("Account created! Please sign in.", "success");
    registerForm.reset();
    document.getElementById("login-tab").click();
  });
}

function showAuthAlert(message, type) {
  const alertBox = document.getElementById("authAlert");
  if (!alertBox) return;
  alertBox.className = `alert alert-${type} py-2 small`;
  alertBox.textContent = message;
  alertBox.classList.remove("d-none");
}

function guardProtectedPages() {
  const isLoginPage = Boolean(document.getElementById("loginForm"));
  const sessionRaw = localStorage.getItem("garagesync_session");

  if (!isLoginPage && !sessionRaw) {
    window.location.href = "index.html";
    return;
  }

  if (sessionRaw) {
    const user = JSON.parse(sessionRaw);
    const navUserDisplay = document.getElementById("navUserDisplay");
    if (navUserDisplay) navUserDisplay.textContent = user.fullName || user.username;
  }

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("garagesync_session");
    window.location.href = "index.html";
  });
}

/* ---------- 2. DASHBOARD & CHARTS ---------- */
function initDashboardPage() {
  const revenueCanvas = document.getElementById("revenueChart");
  if (!revenueCanvas) return;

  const extraJobs = JSON.parse(localStorage.getItem("garagesync_extra_jobs") || "[]");
  const activeExtra = extraJobs.filter((j) => j.status !== "Completed").length;
  const totalRevenue = MONTHLY_REVENUE_DATA.serviceLabor.reduce((a, b) => a + b, 0) +
                       MONTHLY_REVENUE_DATA.partsSales.reduce((a, b) => a + b, 0);

  document.getElementById("kpiRevenue").textContent = `RM ${totalRevenue.toLocaleString()}`;
  document.getElementById("kpiJobs").textContent = 3 + activeExtra;
  document.getElementById("kpiSkus").textContent = PARTS_INVENTORY.length;
  document.getElementById("kpiLowStock").textContent = PARTS_INVENTORY.filter((p) => p.stock < 5).length;

  new Chart(revenueCanvas, {
    type: "bar",
    data: {
      labels: MONTHLY_REVENUE_DATA.labels,
      datasets: [
        { label: "Parts Sales (RM)", data: MONTHLY_REVENUE_DATA.partsSales, backgroundColor: "#dc3545" },
        { label: "Service Labor (RM)", data: MONTHLY_REVENUE_DATA.serviceLabor, backgroundColor: "#6c757d" }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  const categoryTotals = {};
  PARTS_INVENTORY.forEach((item) => {
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.stock;
  });

  new Chart(document.getElementById("categoryChart"), {
    type: "doughnut",
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [{ data: Object.values(categoryTotals), backgroundColor: ["#dc3545", "#fd7e14", "#0dcaf0", "#6c757d"] }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

/* ---------- 3. SERVICE JOBS TABLE (HARDCODED HTML + BROWSER STORAGE) ---------- */
function initJobsPage() {
  const tableBody = document.getElementById("jobsTableBody");
  if (!tableBody) return;

  const searchInput = document.getElementById("jobSearchInput");
  const statusFilter = document.getElementById("jobStatusFilter");
  const resetBtn = document.getElementById("resetJobFilters");
  const addJobForm = document.getElementById("addJobForm");

  const savedJobs = JSON.parse(localStorage.getItem("garagesync_extra_jobs") || "[]");
  savedJobs.forEach((job) => appendJobRowToTable(tableBody, job));

  addJobForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const currentList = JSON.parse(localStorage.getItem("garagesync_extra_jobs") || "[]");
    const nextNumber = 1047 + currentList.length;

    const newJob = {
      id: `JOB-${nextNumber}`,
      date: new Date().toISOString().split("T")[0],
      customer: document.getElementById("newCustomer").value.trim(),
      model: document.getElementById("newModel").value,
      service: document.getElementById("newService").value.trim(),
      technician: document.getElementById("newTechnician").value.trim(),
      status: document.getElementById("newStatus").value,
      cost: parseFloat(document.getElementById("newCost").value) || 0
    };

    currentList.push(newJob);
    localStorage.setItem("garagesync_extra_jobs", JSON.stringify(currentList));
    appendJobRowToTable(tableBody, newJob);

    addJobForm.reset();
    bootstrap.Modal.getInstance(document.getElementById("addJobModal"))?.hide();
    filterTableRows();
  });

  function filterTableRows() {
    const query = searchInput.value.toLowerCase().trim();
    const status = statusFilter.value;
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      const rowStatus = row.cells[6]?.textContent.trim() || "";
      const matchesQuery = text.includes(query);
      const matchesStatus = status === "ALL" || rowStatus === status;
      row.style.display = matchesQuery && matchesStatus ? "" : "none";
    });
  }

  searchInput.addEventListener("input", filterTableRows);
  statusFilter.addEventListener("change", filterTableRows);
  resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    statusFilter.value = "ALL";
    filterTableRows();
  });
}

function appendJobRowToTable(tableBody, job) {
  let badgeClass = "text-bg-info";
  if (job.status === "Completed") badgeClass = "text-bg-success";
  if (job.status === "In Progress") badgeClass = "text-bg-warning";

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td class="fw-bold text-danger">${job.id}</td>
    <td class="small text-secondary">${job.date}</td>
    <td>${job.customer}</td>
    <td><span class="badge text-bg-secondary">${job.model}</span></td>
    <td>${job.service}</td>
    <td>${job.technician}</td>
    <td><span class="badge ${badgeClass}">${job.status}</span></td>
    <td class="text-end fw-semibold">RM ${job.cost.toFixed(2)}</td>
  `;
  tableBody.appendChild(tr);
}

/* ---------- 4. PARTS INVENTORY GRID ---------- */
function initInventoryPage() {
  const grid = document.getElementById("inventoryGrid");
  if (!grid) return;

  const searchInput = document.getElementById("partSearchInput");
  const categoryFilter = document.getElementById("partCategoryFilter");
  const sortSelect = document.getElementById("partSortSelect");

  function renderInventory() {
    const query = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    const sortBy = sortSelect.value;

    let filtered = PARTS_INVENTORY.filter((item) => {
      const matchesQuery = item.sku.toLowerCase().includes(query) || item.name.toLowerCase().includes(query);
      const matchesCategory = category === "ALL" || item.category === category;
      return matchesQuery && matchesCategory;
    });

    if (sortBy === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") filtered.sort((a, b) => b.price - a.price);
    if (sortBy === "stock-asc") filtered.sort((a, b) => a.stock - b.stock);

    document.getElementById("partCountBadge").textContent = filtered.length;

    grid.innerHTML = filtered.map((item) => {
      const badge = item.stock < 5
        ? `<span class="badge text-bg-danger">Low Stock: ${item.stock}</span>`
        : `<span class="badge text-bg-success">In Stock: ${item.stock}</span>`;

      return `
        <div class="col-sm-6 col-lg-3">
          <div class="card border-secondary h-100">
            <div class="card-body d-flex flex-column">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="small text-secondary">${item.sku}</span>
                ${badge}
              </div>
              <span class="badge text-bg-secondary align-self-start mb-2">${item.category}</span>
              <h2 class="h6 fw-bold mb-2">${item.name}</h2>
              <p class="small text-secondary mb-3">${item.compatibility}</p>
              <div class="mt-auto pt-2 border-top border-secondary d-flex justify-content-between align-items-center">
                <span class="fw-bold text-danger">RM ${item.price.toFixed(2)}</span>
                <span class="small text-secondary">${item.location}</span>
              </div>
            </div>
          </div>
        </div>`;
    }).join("");
  }

  searchInput.addEventListener("input", renderInventory);
  categoryFilter.addEventListener("change", renderInventory);
  sortSelect.addEventListener("change", renderInventory);
  renderInventory();
}