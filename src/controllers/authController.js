const { Router } = require("express");
const router = Router();

const User = require("../models/User");

const jwt = require("jsonwebtoken");
const config = require("../config");

router.post("/singin", (req, res, next) => {

    const {email, password} = req.body

    const user = await User.findOne({email: email})

  res.json("singUp");
});
router.post("/singup", async (req, res, next) => {
  const { username, email, password } = req.body;

  const user = new User({
    username,
    email,
    password,
  });
  user.password = await user.encryptPassword(user.password);
  console.log(user);
  await user.save();
  const token = jwt.sign({ id: user._id }, config.secret, {
    expiresIn: 60 * 60 * 24,
  });
  res.json({ auth: true, token });
});

router.get("/me", async (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({
      auth: "false",
      message: "no token provided",
    });
  }

  const decoded = jwt.verify(token, config.secret);
  console.log(decoded);

  const user = await User.findById(decoded.id, { password: 0 });

  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  res.json(user);
});

module.exports = router;
