const express = require("express");
const router = express.Router();
const avatarController = require("../controller/avatar-controller");

// /api/avatar/:avatarPath
router.get("/:avatarPath", avatarController.getAvatar);

// /api/avatar/email/:avatarPath
router.get("/email/:email", avatarController.getAvatarByEmail);

module.exports = router;
