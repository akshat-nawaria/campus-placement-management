const express = require("express");
const {getDashboardStats} = require("../controllers/analytics.controller")
const {requireAuth, requireRole} = require("../middlewares/auth.middleware")
const ROLES = require("../utils/constants")

const router = express.Router();

router.use(requireAuth);

router.get("/dashboard", requireRole([ROLES.ADMIN, ROLES.TPO]), getDashboardStats);

module.exports = router;