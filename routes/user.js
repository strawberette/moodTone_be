const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const saltRounds = parseInt(process.env.SALT_ROUNDS);

const session = { session: false };

//============================== / =======================================

const profile = (req, res, next) => {
  res.status(200).json({
    message: "profile",
    user: req.user,
    token: req.query.secret_token,
  });
};

router.get("/", passport.authenticate("jwt", session), profile);

//============================== register user ============================

// takes the authenticated req and returns a response
const register = async (req, res, next) => {
  try {
    req.user.name
      ? res.status(201).json({ msg: "user registered", userId: req.user.id })
      : res.status(401).json({ msg: "User already exists" });
  } catch (error) {
    next(error);
  }
};

// http://localhost/user/registeruser
//register router - authenticate using registerStrategy (named 'register') and
// passes on the register function defined above
router.post(
  "/registeruser",
  passport.authenticate("register", session),
  register
);

//============================== login ===============================

const login = async (req, res, next) => {
  passport.authenticate("login", (error, user) => {
    try {
      if (error) {
        res.status(500).json({ message: "Internal Server Error" });
      } else if (!user) {
        res.status(401).json({ message: "not authourized" });
      } else {
        const loginFn = (error) => {
          if (error) {
            return next(error);
          } else {
            const userData = { id: user.id, name: user.name };
            const data = {
              user,
              token: jwt.sign({ user: userData }, process.env.SECRET_KEY),
            };
            res.status(200).json({
              user: { name: user.name, id: user.id },
              token: data.token,
            });
          }
        };

        req.login(user, session, loginFn);
      }
    } catch (error) {
      return next(error);
    }
  })(req, res, next); //IFFY - Immediately Invoked Function Expression
};

router.post("/login", login);

//============================== =====================================

// get a single user
router.get("/:id", passport.authenticate("jwt", session), async (req, res) => {
  if (req.user.id !== parseInt(req.params.id)) {
    return res
      .status(403)
      .json({ message: "You are not authorised to access this" });
  }

  const user = await User.findOne({ where: { id: req.params.id } });
  user.passwordHash = undefined;
  res.status(200).json({ msg: user });
});

// update a single user
router.put("/:id", passport.authenticate("jwt", session), async (req, res) => {
  if (req.user.id !== parseInt(req.params.id)) {
    return res
      .status(403)
      .json({ message: "You are not authorised to access this" });
  }

  const updatedUser = await User.update(
    { name: req.body.newName },
    { where: { id: req.params.id } }
  );
  const user = await User.findOne({ where: { id: req.params.id } });
  res.status(200).json({ msg: user });
});

// delete a single user
router.delete(
  "/:id",
  passport.authenticate("jwt", session),
  async (req, res) => {
    if (req.user.id !== parseInt(req.params.id)) {
      return res
        .status(403)
        .json({ message: "You are not authorised to access this" });
    }

    const user = await User.findOne({ where: { id: req.params.id } });
    const deletedUser = await user.destroy();
    console.log(deletedUser);
    res.status(200).json({ msg: deletedUser });
  }
);

module.exports = router;
