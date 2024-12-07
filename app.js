const express = require("express");
const companiesRoutes = require("./routes/companies");
const invoicesRoutes = require("./routes/invoices");
const industriesRoutes = require("./routes/industries");

app.use("/industries", industriesRoutes);

const app = express();

app.use(express.json());

app.use("/companies", companiesRoutes);
app.use("/invoices", invoicesRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;

