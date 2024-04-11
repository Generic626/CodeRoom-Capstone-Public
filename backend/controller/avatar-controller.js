const fs = require("fs");
const path = require("path");
const axios = require("axios");
const User = require("../models/user");

const getAvatar = (req, res) => {
  const { avatarPath } = req.params;
  let filePath = path.resolve(__dirname, `../avatars/${avatarPath}`);

  if (!fs.existsSync(filePath)) {
    res.sendFile(path.resolve(__dirname, "../avatars/default.png"));
  } else {
    res.sendFile(filePath);
  }
};

const getAvatarByEmail = async (req, res) => {
  const { email } = req.params;

  let userAvatar;
  const user = await User.findOne({ email: email });

  if (user == null || user == undefined) {
    console.log("[getAvatarByEmail] no such user exist");
    return res.status(404).json({ message: "User not found" });
  }
  userAvatar = user.avatar;

  let filePath = path.resolve(__dirname, `../avatars/${userAvatar}`);

  if (!fs.existsSync(filePath)) {
    res.sendFile(path.resolve(__dirname, "../avatars/default.png"));
  } else {
    res.sendFile(filePath);
  }
};

exports.getAvatar = getAvatar;
exports.getAvatarByEmail = getAvatarByEmail;
