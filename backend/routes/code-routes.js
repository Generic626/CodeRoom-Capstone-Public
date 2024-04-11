const express = require("express");
const router = express.Router();
const codeController = require("../controller/code-controller");
const codeControllerV2 = require("../controller/code-controller-v2");
const authenticateToken = require("../functions/authenticateToken.js");

// /api/code
router.route("/").post(authenticateToken, codeController.submitCodeRequest);
router.route("/v2").post(authenticateToken, codeControllerV2.submitCodeRequest);

module.exports = router;
