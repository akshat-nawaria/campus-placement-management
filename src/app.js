const express = require("express")
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require("../src/routes/auth.routes")
const studentRoutes = require("./routes/student.routes")
const app = express()

app.use(express.json()); // Parse JSON bodies
app.use(cors());         // Allow cross-origin requests
app.use(helmet());       // Security headers

app.use("/api/auth", authRoutes)
app.use("/api/students", studentRoutes);

module.exports = app;