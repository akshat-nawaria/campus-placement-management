const express = require("express");
const {createJob, getAllJobs, getEligibleStudents, overrideEligibility} = require("../controllers/job.controller")
const {requireAuth, requireRole} = require("../middlewares/auth.middleware")
const ROLES = require("../utils/constants");
const router = express.Router();


router.use(requireAuth);

router.post("/add", requireRole([ROLES.ADMIN, ROLES.TPO]), createJob);

router.get("/list", getAllJobs);

// Run eligibility engine for a specific job
router.get("/:jobId/eligible-students", requireRole([ROLES.ADMIN, ROLES.TPO]), getEligibleStudents);

router.post("/:jobId/override", requireRole([ROLES.ADMIN, ROLES.TPO]), overrideEligibility);

module.exports = router;