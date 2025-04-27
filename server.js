const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
require("./config/db");
const PORT = process.env.PORT || 8000;
app.get("/ping", (req, res) => {
  res.send("PONGI");
});
app.use(bodyParser.json());
app.use(cors());
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/project", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
