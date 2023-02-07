require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./utils/database");
const User = require("./models/user");
const Chat = require("./models/chat");
const Group = require("./models/group");
const UserGroup = require("./models/user-group");

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
Group.hasMany(Chat);
Chat.belongsTo(Group);

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log("Error:", err));
