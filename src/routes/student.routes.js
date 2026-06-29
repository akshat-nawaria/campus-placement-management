const express = require("express");
const { createOrUpdateProfile, getProfile, verifyProfile, getAllStudents } = require("../controllers/student.controller");
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");
const ROLES = require("../utils/constants");

const router = express.Router();

// Apply requireAuth to all routes in this file
router.use(requireAuth);

// GET all students (TPO only)
router.get("/", requireRole([ROLES.TPO, ROLES.ADMIN]), getAllStudents);

router.post("/profile", requireRole([ROLES.STUDENT]), upload.single("resume"), createOrUpdateProfile);

router.get("/profile", requireRole([ROLES.STUDENT]), getProfile);

router.put("/:studentId/verify", requireRole([ROLES.TPO, ROLES.ADMIN]), verifyProfile)

module.exports = router