require("dotenv").config();
const express = require("express");
const passport = require("passport");
const connection = require("./connection");
const cors = require("cors");
const User = require("./models/user");
const userRouter = require("./routes/user");
const {
  registerStrategy,
  loginStrategy,
  verifyStrategy,
} = require("./middleware/auth");

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(passport.initialize());
app.use("/user", userRouter);

passport.use("register", registerStrategy);
passport.use("login", loginStrategy);
passport.use(verifyStrategy);

app.listen(process.env.PORT, () => {
  connection.authenticate();
  User.sync({ alter: true });
  console.log("App is online");
});
