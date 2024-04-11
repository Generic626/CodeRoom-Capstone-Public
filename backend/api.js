const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const notebookRoutes = require("./routes/notebook-routes");
const userRoutes = require("./routes/user-routes");
const codeRoutes = require("./routes/code-routes");
const avatarRoutes = require("./routes/avatar-routes");
require("dotenv").config();

// establish Express Server
const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());

// routers

app.use("/api/notebook", notebookRoutes);
app.use("/api/user", userRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/avatar", avatarRoutes);
app.use(express.static("avatars"));

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => {
    app.listen(5001, () => {
      console.log("[mongoose] mongoDB connected");
      console.log("[connected] API connected at PORT 5001");
    });
  })
  .catch();
