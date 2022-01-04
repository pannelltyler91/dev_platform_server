const express = require("express");
const cors = require("cors");
const router = express.Router();
const db = require("../models");

router.use(cors());
router.use(express.json());


module.exports = router;
