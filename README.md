# GarageSync — Motorcycle Workshop & Parts Inventory Manager

**Author:** Adlin Syahmi  
**Course:** IMS566 — Advanced Web Design Development and Content Management (UiTM)

## Project Description
**GarageSync** is a responsive web application prototype developed for **IMS566**. It demonstrates structured content management, client-side session authentication, left-sidebar navigation, interactive data visualisations, browser `localStorage` record creation, and multi-view dataset filtering for a motorcycle performance workshop.

## Features Included
- **Authentication Page (`index.html`):** Displays hardcoded login credentials directly on the interface alongside Login and Account Registration forms with validation and inline error alerts.
- **Responsive Left Sidebar Navigation:** Collapsible Bootstrap 5 offcanvas/sidebar menu linking all pages consistently across desktop and mobile viewports.
- **Operational Dashboard (`dashboard.html`):** KPI summary cards and two interactive Chart.js visualisations (Monthly Revenue Bar Chart & Category Stock Doughnut Chart).
- **Data View 1 — Service Jobs (`jobs.html`):** Hardcoded HTML work order table with live search, status filtering, and an **Add Service Job** modal that persists new records in browser `localStorage`.
- **Data View 2 — Parts Inventory (`inventory.html`):** Responsive card grid displaying parts metadata (SKU, category, compatibility, rack location, price, and stock badges) with live search, category filter, and sorting.
- **Structured Content & Footer:** Semantic HTML5 landmarks, metadata tags, and consistent footer across all pages.

## Instructions to Test Login
1. Open the live GitHub Pages URL (or `index.html` in Google Chrome).
2. Enter the credentials shown on the login card (or click **Auto-Fill Demo Login**):
   - **Username:** `admin`
   - **Password:** `ims566`
3. Click **Sign In**, or switch to the **Register** tab to create a new local account.

## Frameworks & Libraries Used
- **HTML5 & CSS3**
- **Bootstrap 5.3.3**
- **Bootstrap Icons 1.11.3**
- **Chart.js 4.4.3**
- **Vanilla JavaScript (ES6+)** & Browser `localStorage`