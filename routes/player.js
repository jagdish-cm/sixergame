var express = require("express");
var Player = require("../models/player");
var router = express.Router();

/* create player */
router.post("/", async (req, res, next) => {
  let playersCount = await Player.count();
  if (playersCount < 10) {
    let player = await new Player({
      playerId: req.body.playerId,
    });
    player.save((error, player) => {
      if (error) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(200).json({ msg: "Player added" });
      }
    });
  } else {
    res.status(403).json({ msg: "Max players limit reached" });
  }
});

module.exports = router;
