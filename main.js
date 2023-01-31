require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./utils/database");

const authRoutes = require("./routes/auth");

const app = express();
app.use(bodyParser.json());

app.use(authRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log("Error:", err));
