const express = require("express");
const router = express.Router();

const UserControllers = require("../controllers/users");

router.get("/getAllUsers", UserControllers.getAllUsers);

router.post("/createUser", UserControllers.createUser);

module.exports = router;
