const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middlewares/auth");
const ChatControllers = require("../controllers/chats");

router.post("/sendMessage", AuthMiddleware, ChatControllers.sendMessage);

router.get("/getAllChats", AuthMiddleware, ChatControllers.getAllChats);

module.exports = router;
