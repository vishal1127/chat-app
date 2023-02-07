const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_JWT_KEY;

const User = require("../models/user");

exports.createUser = async (req, res, next) => {
  const { name, email, phone, password } = req.body;
  try {
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });
    if (existingUser)
      return res.status(400).json({
        message: "User with this email is already registered",
        success: false,
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const userDetails = await User.create({
      name: name,
      email: email,
      phone: phone,
      password: hashedPassword,
    });
    res.status(200).json({
      message: "Account created successfuly",
      UserDetails: userDetails,
      success: true,
    });
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error, success: false });
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch)
      return res.status(401).json({
        message: "Password is incorrect",
        success: false,
      });
    const token = await jwt.sign(
      {
        email: email,
        id: existingUser.id,
      },
      SECRET_KEY
    );
    res
      .status(200)
      .json({ message: "Login successful", user: existingUser, token: token });
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error, success: false });
  }
};
