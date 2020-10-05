const { Router } = require("express");
const router = Router();

const User = require("../models/User");
const verifyToken = require('./verifyToken')
const jwt = require("jsonwebtoken");

router.post("/singin", verifyToken, async (req, res, next) => {
  

  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({
      message: "the email doesn't exits",
    });
  }

  const passwordValid = await user.validatePassword(password);
  console.log(passwordValid);
  if (!passwordValid) {
    return res.status(404).json({
      auth: false,
      token: null,
    });
  }

  jwt.sign({ id: user.id }, proccess.env.secret, {
    expiresIn: 69 * 60 * 24,
  });

  res.json({ auth: true, token });
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
  const token = jwt.sign({ id: user._id }, proccess.env.secret, {
    expiresIn: 60 * 60 * 24,
  });
  res.json({ auth: true, token });
});

router.get("/me", verifyToken, async (req, res, next) => {

  const user = await User.findById(req.userId, {password: 0 });

  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  await res.json(user);
});

module.exports = router;
