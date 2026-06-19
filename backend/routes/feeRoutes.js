const express = require("express");
const router = express.Router();
const {
  addFee,
  getFees,
} = require("../controllers/feeController");

router.post("/", addFee);
router.get("/", getFees);

module.exports = router;