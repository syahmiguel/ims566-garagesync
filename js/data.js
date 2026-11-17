const DEFAULT_USERS = [
  { username: "admin", password: "ims566", fullName: "Adlin Syahmi" }
];

const MONTHLY_REVENUE_DATA = {
  labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
  serviceLabor: [3200, 3850, 4100, 3900, 4650, 5200],
  partsSales: [4800, 5400, 6150, 5900, 7100, 7950]
};

const PARTS_INVENTORY = [
  { sku: "PRT-001", name: "Programmable Racing ECU (Y15ZR/Y16ZR)", category: "Engine & ECU", compatibility: "Yamaha Y15ZR / Y16ZR", price: 420.00, stock: 4, location: "Rack A1" },
  { sku: "PRT-002", name: "6-Spring Performance Racing Clutch Kit", category: "Engine & ECU", compatibility: "Yamaha Y15ZR / LC135", price: 210.00, stock: 7, location: "Rack A2" },
  { sku: "PRT-003", name: "Red Anodized Salaya Engine & Cover Screw Set", category: "Hardware & CNC", compatibility: "Universal Yamaha Underbone", price: 65.00, stock: 18, location: "Drawer B1" },
  { sku: "PRT-004", name: "Red CNC Brake Hose & Caliper Bracket Set", category: "Hardware & CNC", compatibility: "Yamaha Y15ZR / Y16ZR", price: 85.00, stock: 3, location: "Drawer B3" },
  { sku: "PRT-005", name: "Koyoko YTZ5S-BS 12V 5Ah Gel Battery", category: "Electrical & Lighting", compatibility: "Y15ZR / Y16ZR / LC135", price: 95.00, stock: 11, location: "Shelf C1" },
  { sku: "PRT-006", name: "TST Smoked Integrated LED Tail Lamp", category: "Electrical & Lighting", compatibility: "Yamaha Y15ZR / Y16ZR", price: 155.00, stock: 6, location: "Shelf C2" },
  { sku: "PRT-007", name: "Heavy-Duty Chain Degreaser & Lube Bundle (500ml)", category: "Maintenance & Fluids", compatibility: "All O-Ring / X-Ring Chains", price: 42.00, stock: 22, location: "Bay D1" },
  { sku: "PRT-008", name: "High-Strength Blue Threadlocker & Metal Polish", category: "Maintenance & Fluids", compatibility: "Workshop Consumable", price: 34.00, stock: 2, location: "Bay D2" }
];