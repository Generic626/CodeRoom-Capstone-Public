const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: process.env.DEFAULT_AVATAR_PATH },
});

module.exports = mongoose.model("User", userSchema);
