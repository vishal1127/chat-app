require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const CronJob = require("cron").CronJob;

const sequelize = require("./utils/database");
const User = require("./models/user");
const Chat = require("./models/chat");
const Group = require("./models/group");
const UserGroup = require("./models/user-group");
const ArchivedChats = require("./models/archived-chat");

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chats");
const groupRoutes = require("./routes/groups");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(authRoutes);
app.use(chatRoutes);
app.use(groupRoutes);

User.hasMany(Chat);
Chat.belongsTo(User);
User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });
User.hasMany(UserGroup);
UserGroup.belongsTo(User);
Group.hasMany(UserGroup);
UserGroup.belongsTo(Group);
Group.hasMany(Chat);
Chat.belongsTo(Group);

const job = new CronJob("00 00 00 * * *", function () {
  const d = new Date();
  console.log("Every Midnight:", d);
});
job.start();

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log("Error:", err));
