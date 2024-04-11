const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notebookSchema = new Schema({
  code: { type: String, required: true },
  question: { type: String, required: true },
  readOnly: { type: Boolean, required: true },
  cloned: { type: Boolean, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ["javascript", "python"], required: true },
  author: {
    email: { type: String, required: true },
  },
  sharedWith: [
    {
      email: { type: String },
    },
  ],
  createdDate: { type: Date, required: true },
  lastOpenAt: { type: Date, required: true },
});

module.exports = mongoose.model("Notebook", notebookSchema);
