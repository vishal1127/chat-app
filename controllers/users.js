const sequelize = require("../utils/database");
const bcrypt = require("bcrypt");

const User = require("../models/user");

exports.getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.findAll();
    res.status(200).json({ UsersList: allUsers, success: true });
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error, success: false });
  }
};

exports.createUser = async (req, res, next) => {
  const { name, email, phone, password } = req.body;
  try {
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });
    if (existingUser)
      return res
        .status(400)
        .json({
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
    res
      .status(200)
      .json({
        message: "User successfuly created",
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
