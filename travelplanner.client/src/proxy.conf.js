const PROXY_CONFIG = [
  {
    context: [
      "/api",            // General API path
      "/weatherforecast", // Weather API
      "/users",           // User management
      "/products",        // Product data
      "/orders"           // Orders and transactions
    ],
    target: "https://localhost:53087", // Backend server
    secure: false,                     // Disable SSL validation for development
    changeOrigin: true                 // Handle CORS if backend is on a different domain
  }
];

module.exports = PROXY_CONFIG;
