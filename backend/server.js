const express = require("express");
const cors = require("cors");
const plantRoutes = require("./routes/plantRoutes");

const app = express();
app.use(cors({ origin: "http://localhost:5173" })); // allow frontend
app.use(express.json());

// Routes
app.use("/api/plants", plantRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
