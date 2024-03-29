const { Op } = require("sequelize");
const Chat = require("../models/chat");
const Group = require("../models/group");
const S3Services = require("../services/s3Services");

exports.sendPublicMessage = async (req, res, next) => {
  const { text } = req.body;
  try {
    const textData = await req.user.createChat({
      from: req.user.name,
      text: text,
    });
    res.status(200).json({ message: "Message sent", success: true });
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error, success: false });
  }
};

exports.getPublicChats = async (req, res, next) => {
  const lastMsgId = req.query.lastMsgId;
  try {
    const allChats = await Chat.findAll({
      order: [["createdAt", "ASC"]],
      where: {
        id: {
          [Op.gt]: lastMsgId,
        },
        groupId: null,
      },
    });
    res
      .status(200)
      .json({ message: "Chats found", chats: allChats, success: true });
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error, success: false });
  }
};

exports.sendGroupMessage = async (req, res, next) => {
  const { text } = req.body;
  const groupId = req.params.groupId;
  try {
    const group = await Group.findByPk(groupId);
    const textData = await group.createChat({
      from: req.user.name,
      text: text,
    });
    res.status(200).json({ message: "Message sent", success: true });
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error, success: false });
  }
};

exports.getGroupChats = async (req, res, next) => {
  // const lastMsgId = req.query.lastMsgId;
  const groupId = req.params.groupId;
  try {
    const group = await Group.findByPk(groupId);
    const groupChats = await Chat.findAll({
      order: [["createdAt", "ASC"]],
      where: {
        // id: {
        //   [Op.gt]: lastMsgId,
        // },
        groupId: group.id,
      },
    });
    res
      .status(200)
      .json({ message: "Chats found", groupChats: groupChats, success: true });
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error, success: false });
  }
};

exports.storeFileInPublicChat = async (req, res, next) => {
  const file = req.body;
  console.log("file>>>>>>>>", file);
  // const user = req.user;
  // try {
  //   // const allExpenses = await UserServices.getExpenses(req);
  //   // const stringifiedExpenses = JSON.stringify(allExpenses);
  //   const fileName = `File${user.id}/${new Date()}.txt`;
  //   const fileUrl = await S3Services.uploadToS3(file, fileName);
  //   const fileUrlAdded = await user.createChat({
  //     from: user.name,
  //     text: fileUrl,
  //   });
  //   res.status(200).json({
  //     message: "File uploaded successfuly",
  //     fileUrl: fileUrl,
  //     fileUrlAdded: fileUrlAdded,
  //     success: true,
  //   });
  // } catch (error) {
  //   console.log("error", error);
  //   res
  //     .status(500)
  //     .json({ message: "Something went wrong", success: false, error: error });
  // }
};
