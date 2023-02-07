const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_JWT_KEY;
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      //decrypting token
      let userDetails = await jwt.verify(req.headers.authorization, SECRET_KEY);
      req.userId = userDetails.id;
      const user = await User.findOne({
        where: {
          id: req.userId,
        },
      });
      req.user = user;
    } else {
      res.status(401).json({ message: "Unauthorized User" });
    }
    next();
  } catch (error) {
    console.log("Error:", error);
    res.status(401).json({ message: "Unauthorized User" });
  }
};

module.exports = auth;
