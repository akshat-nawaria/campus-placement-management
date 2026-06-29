const express = require("express");
const {requireAuth, requireRole} = require("../middlewares/auth.middleware")
const router = express.Router();
const ROLES = require("../utils/constants")
const {applyForJob, getApplicationsForJob, getMyApplications, updateApplicationStatus, bulkUpdateStatus} = require("../controllers/application.controller")

router.use(requireAuth);

router.post("/:jobId/apply", requireRole([ROLES.STUDENT, ROLES.ADMIN]), applyForJob);

// Student views their own applications
router.get("/student", requireRole([ROLES.STUDENT, ROLES.ADMIN]), getMyApplications);

router.get("/job/:jobId", requireRole([ROLES.ADMIN, ROLES.TPO]), getApplicationsForJob);

router.put("/:applicationId/status", requireRole([ROLES.ADMIN, ROLES.TPO]), updateApplicationStatus);

router.put("/job/:jobId/bulk-status", requireRole([ROLES.TPO, ROLES.ADMIN]), bulkUpdateStatus);


module.exports = router;