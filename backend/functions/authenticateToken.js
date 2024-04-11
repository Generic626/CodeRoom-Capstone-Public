const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    console.log("[auth] no token error");
    return res.status(401).json({
      message: "Operation not allowed, please be authenticated to use",
    });
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
    if (err) {
      console.log("[auth] JWT invalid error");
      return res.sendStatus(401).json({
        message: "Operation not allowed, please be authenticated to use",
      });
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
