var express = require("express");
var router = express.Router();
var User = require("../models/user");

router.post("/", async (req, res, next) => {
  try {
    let user = new User({
      email: req.body.email,
      userId: req.body.userId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    user.save((error, user) => {
      if (error) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(200).json({ msg: user });
      }
    });
  } catch (error) {
    res.status(403).json({ error: error.msg });
  }
});

module.exports = router;
