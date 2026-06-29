const express = require("express")
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const authRoutes = require("../src/routes/auth.routes")
const studentRoutes = require("./routes/student.routes")
const companyRoutes = require("./routes/company.routes")
const jobRoutes = require("./routes/job.routes");
const applicationRoutes = require("./routes/application.routes");
const offerRoutes = require("./routes/offer.routes");
const analyticsRoutes = require("./routes/analytics.routes")
const app = express()

app.use(express.json()); // Parse JSON bodies
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(helmet());       // Security headers

// Serve uploaded files (resumes)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use("/api/auth", authRoutes)
app.use("/api/students", studentRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/analytics", analyticsRoutes);

module.exports = app;