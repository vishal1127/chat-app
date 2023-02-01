require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./utils/database");
const User = require("./models/user");
const Chat = require("./models/chat");

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chats");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(authRoutes);
app.use(chatRoutes);

User.hasMany(Chat);
Chat.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log("Error:", err));
