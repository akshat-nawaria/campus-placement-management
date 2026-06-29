const express = require("express");
const {requireAuth, requireRole} = require("../middlewares/auth.middleware")
const router = express.Router();
const {issueOffer, acceptOffer, getMyOffer, getAllOffers} = require("../controllers/offer.controller")
const ROLES = require("../utils/constants")

router.use(requireAuth);

// Student views their own offer
router.get("/my", requireRole([ROLES.STUDENT]), getMyOffer);

// TPO views all offers
router.get("/", requireRole([ROLES.ADMIN, ROLES.TPO]), getAllOffers);

router.post("/issue", requireRole([ROLES.ADMIN, ROLES.TPO]), issueOffer);

router.put("/:offerId/accept", requireRole([ROLES.STUDENT]), acceptOffer);

module.exports = router;