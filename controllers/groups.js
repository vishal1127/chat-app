const Group = require("../models/group");
const User = require("../models/user");
const UserGroup = require("../models/user-group");
const { Op } = require("sequelize");

exports.createGroup = async (req, res, next) => {
  const { name } = req.body;
  try {
    console.log("admin id------------------", req.user.id);
    const newGroup = await req.user.createGroup(
      {
        name: name,
        admin: req.user.id,
      },
      {
        through: { status: "accepted" },
      }
    );
    res.status(200).json({ message: "New group created!", success: true });
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error, success: false });
  }
};

exports.getGroupNameList = async (req, res, next) => {
  const user = req.user;
  console.log("User::::::::::::::::", user);
  try {
    let groupNameList = await UserGroup.findAll({
      where: {
        userId: req.user.id,
        status: "accepted",
      },
    });
    groupNameList = await Promise.all(
      groupNameList.map(async (obj) => {
        try {
          let groupData = await Group.findOne({
            where: {
              id: obj.groupId,
            },
          });
          obj.dataValues.groupName = groupData.name;
          return obj;
        } catch (error) {
          console.log("Error:", error);
        }
      })
    );
    res.status(200).json({
      message: "Group name list fetched",
      groupNameList: groupNameList,
      success: true,
    });
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error, success: false });
  }
};

//get all users for sending group invites
exports.getUsersForInvite = async (req, res, next) => {
  const user = req.user;
  const groupId = req.params.groupId;
  let usersInvited = [];
  try {
    let allUsers = await User.findAll({
      where: {
        id: {
          [Op.ne]: user.id,
        },
      },
    });
    await Promise.all(
      allUsers.map(async (user) => {
        try {
          const data = await UserGroup.findOne({
            where: {
              userId: user.id,
              groupId: groupId,
            },
          });
          if (data != null) usersInvited.push(data);
        } catch (error) {
          console.log("Error inside:", error);
        }
      })
    );
    const usersForInvite = allUsers.filter((user) => {
      let flag = false;
      usersInvited.forEach((userInvited) => {
        if (userInvited.userId == user.id) {
          flag = true;
        }
      });
      if (!flag) return user;
    });
    res.status(200).json({
      message: "Users found",
      userList: usersForInvite,
      success: true,
    });
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error, success: false });
  }
};

//Invite sent from group admin to a user
exports.sendGroupInviteRequest = async (req, res, next) => {
  const userId = req.params.userId;
  const groupId = req.params.groupId;
  try {
    const groupInvite = await UserGroup.create({
      userId: userId,
      groupId: groupId,
      status: "pending",
    });
    res.status(200).json({
      message: "Group invite sent",
      groupDetails: groupInvite,
      success: true,
    });
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error, success: false });
  }
};

//The group requests a user will get from the group admin
exports.getGroupInvites = async (req, res, next) => {
  try {
    let joinRequests = await UserGroup.findAll({
      where: {
        status: "pending",
        userId: req.user.id,
      },
    });
    const newJoinReq = await Promise.all(
      joinRequests.map(async (obj) => {
        try {
          let groupData = await Group.findOne({
            where: {
              id: obj.groupId,
            },
          });
          obj.dataValues.groupName = groupData.name;
          return obj;
        } catch (error) {
          console.log("Error:", error);
        }
      })
    );
    res.status(200).json({
      message: "Invite requests found",
      requests: newJoinReq,
      success: true,
    });
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error, success: false });
  }
};

exports.acceptGroupInvite = async (req, res, next) => {
  const user = req.user;
  const groupId = req.params.groupId;
  try {
    const groupInvite = await UserGroup.update(
      { status: "accepted" },
      {
        where: {
          userId: user.id,
          groupId: groupId,
        },
      }
    );
    res.status(200).json({ message: "Invitation accepted", success: true });
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error, success: false });
  }
};

exports.rejectGroupInvite = async (req, res, next) => {
  const user = req.user;
  const groupId = req.params.groupId;
  try {
    const groupInvite = await UserGroup.update(
      { status: "rejected" },
      {
        where: {
          userId: user.id,
          groupId: groupId,
        },
      }
    );
    res.status(200).json({ message: "Invitation accepted", success: true });
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error, success: false });
  }
};
