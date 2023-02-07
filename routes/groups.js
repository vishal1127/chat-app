const express = require("express");
const router = express.Router();
const GroupControllers = require("../controllers/groups");
const AuthMiddleware = require("../middlewares/auth");

router.post("/createGroup", AuthMiddleware, GroupControllers.createGroup);

router.get(
  "/getUsersForInvite/:groupId",
  AuthMiddleware,
  GroupControllers.getUsersForInvite
);

router.get(
  "/getGroupNameListing",
  AuthMiddleware,
  GroupControllers.getGroupNameList
);

router.get(
  "/sendGroupInvite/:userId/:groupId",
  AuthMiddleware,
  GroupControllers.sendGroupInviteRequest
);

router.get(
  "/getGroupInvites",
  AuthMiddleware,
  GroupControllers.getGroupInvites
);

router.get(
  "/acceptGroupInvite/:groupId",
  AuthMiddleware,
  GroupControllers.acceptGroupInvite
);

router.get(
  "/rejectGroupInvite/:groupId",
  AuthMiddleware,
  GroupControllers.rejectGroupInvite
);

module.exports = router;
