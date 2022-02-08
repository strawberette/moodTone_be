require("dotenv").config();
const express = require("express");
const passport = require("passport");
const connection = require("./connection");
const cors = require("cors");
const User = require("./models/user");
const Track = require("./models/track");
const Mood = require("./models/mood");
const userRouter = require("./routes/user");
const trackRouter = require("./routes/track");
const moodRouter = require("./routes/mood");

const {
  registerStrategy,
  loginStrategy,
  verifyStrategy,
} = require("./middleware/auth");
const { Sequelize } = require("sequelize");

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(passport.initialize());
app.use("/user", userRouter);
app.use("/track", trackRouter);
app.use("/mood", moodRouter);

passport.use("register", registerStrategy);
passport.use("login", loginStrategy);
passport.use(verifyStrategy);

// Table associations
Mood.hasMany(Track);
User.hasMany(Track);

app.listen(process.env.PORT, () => {
  connection.authenticate();
  connection.sync({ alter: true });
  console.log("App is online");
});
