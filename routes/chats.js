const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middlewares/auth");
const ChatControllers = require("../controllers/chats");

router.post(
  "/sendPublicMessage",
  AuthMiddleware,
  ChatControllers.sendPublicMessage
);

router.get("/getPublicChats", AuthMiddleware, ChatControllers.getPublicChats);

router.post(
  "/sendGroupMessage/:groupId",
  AuthMiddleware,
  ChatControllers.sendGroupMessage
);

router.get(
  "/getGroupChats/:groupId",
  AuthMiddleware,
  ChatControllers.getGroupChats
);

router.post(
  "/storeFileInPublicChat",
  AuthMiddleware,
  ChatControllers.storeFileInPublicChat
);

module.exports = router;
