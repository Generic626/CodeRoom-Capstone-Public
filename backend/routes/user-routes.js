const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

// import controller functions
const userController = require("../controller/user-controller");
const authenticateToken = require("../functions/authenticateToken.js");

// set up for uploading images
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "avatars/"); // specify the storage directory of the images
  },
  filename: (req, file, cb) => {
    const fileName = uuidv4() + ".jpg"; // generate a random name for the image
    cb(null, fileName); // set the file name
  },
});
const upload = multer({ storage });

// /api/user/emails
router.route("/emails").get(authenticateToken, userController.getAllUserEmails);

// /api/user/create-account
router.route("/create-account").post(userController.createUserAccount);

// /api/user/login
router.route("/login").post(userController.loginUser);

// /api/user/update
router
  .route("/")
  .patch(
    authenticateToken,
    upload.single("avatar"),
    userController.updateUserAccount
  );

module.exports = router;
