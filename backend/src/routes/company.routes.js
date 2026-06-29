const express = require("express");

const {addCompany, getAllCompanies} = require("../controllers/company.controller")
const {requireAuth, requireRole} = require("../middlewares/auth.middleware")
const ROLES = require("../utils/constants")
const router = express.Router();


router.use(requireAuth);


//onlu TPO and admin can add a new comapny
router.post("/add", requireRole([ROLES.TPO, ROLES.ADMIN]), addCompany);


//anyone can view the list of all comapnies
router.get("/list", getAllCompanies);

module.exports = router;