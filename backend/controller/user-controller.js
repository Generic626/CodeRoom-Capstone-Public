const User = require("../models/user");
const Notebook = require("../models/notebook");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

// [POST] handles login user request
// [DESC] attempt to login the user
// [RETURNS] successful message
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 1. attempt to find user
    const user = await User.findOne({ email });
    // If no user, return error
    if (!user) {
      console.log("[loginUser] no such user exist");
      return res.status(401).json({ message: "No such user exist" });
    }

    // 2. validate user's password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // If failed, return error
    if (!isPasswordValid) {
      console.log("[loginUser] invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. generates a JWT token for the user
    const token = jwt.sign(
      // { id: user._id, email: user.email, avatar: user.avatar, name: user.name },
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_ACCESS_SECRET
      // {
      //   expiresIn: "1h",
      // }
    );
    console.log("[loginUser] success");

    // 4. returns successful status with JWT
    res.status(200).json({
      token: token,
      email: user.email,
      avatar: user.avatar,
      name: user.name,
    });
  } catch (error) {
    console.log("[loginUser] internal server error");
    res.status(500).json({ message: "An error occurred" });
  }
};

// [POST] handles create user account request
// [DESC] creates a user account
// [RETURNS] successful message
const createUserAccount = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. hash the  given password using bcrypt
    const hashedPw = await bcrypt.hash(password, 10);
    // 2. create user json payload
    const payload = {
      name,
      email,
      password: hashedPw,
      avatar: "default.png",
    };
    // 3. create user instance and save it to mongoDB
    const newUser = new User(payload);
    await newUser.save();
    console.log("[createUserAccount] success");

    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    if (error.code === 11000) {
      // trigger when unique email detected (defined by mongoDB)
      console.log("[createUserAccount] internal server error");
      res.status(400).json({ message: "Email already exists" });
    } else {
      console.log(error);
      // default error trigger
      console.log("[createUserAccount] internal server error");
      res.status(500).json({ message: "An error occurred" });
    }
  }
};

// [PATCH] update user account
// [DESC] updates user account information
// [RETURNS] successful message
const updateUserAccount = async (req, res, next) => {
  const { email, name } = req.body;

  const avatar = req.file;

  const userPayload = { avatar: avatar.filename, name };

  try {
    const user = await User.findOne({ email: email });
    // delete exisiting of the user
    if (!(user.avatar == "default.png")) {
      fs.unlink(`avatars/${user.avatar}`, (err) => {
        if (err) {
          console.log("[updateUserAccount] removed failed, no such file");
        }
      });
    }

    // update user
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { $set: userPayload },
      { new: true }
    );
    if (!updatedUser) {
      console.log("[updateUserAccount] user not found error");
      return res.status(404).json({ message: "User not found" });
    }
    console.log("[updateUserAccount] success");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("[updateUserAccount] internal server error");
    res.status(500).json({ message: "An error occurred" });
  }
};

// [GET] get user's email
// [DESC] get all user's email
// [RETURNS] email json
const getAllUserEmails = async (req, res, next) => {
  try {
    const senderEmail = req.user.email;
    const users = await User.find({ email: { $ne: senderEmail } }, "email");
    const emails = users.map((user) => user.email);

    console.log("[getAllUserEmails] success");
    res.status(200).json(emails);
  } catch (error) {
    console.log("[getAllUserEmails] internal server error");
    res.status(500).json({ error: "Server Error" });
  }
};

// [POST] reset password
// [DESC] resets the user's password
// [RETURNS] successful message
const resetPassword = async (req, res) => {
  res.status(200).json({ message: "success" });
};

exports.loginUser = loginUser;
exports.createUserAccount = createUserAccount;
exports.updateUserAccount = updateUserAccount;
exports.getAllUserEmails = getAllUserEmails;
exports.resetPassword = resetPassword;
