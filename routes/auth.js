const express = require("express");
const router = express.Router();

const UserControllers = require("../controllers/users");

router.post("/createUser", UserControllers.createUser);

router.post("/loginUser", UserControllers.loginUser);

module.exports = router;
