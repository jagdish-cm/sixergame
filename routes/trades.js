var express = require("express");
var router = express.Router();
var Trade = require("../models/trade");
var User = require("../models/user");
var Player = require("../models/player");

/* Buy */
router.post("/buy", async (req, res, next) => {
  try {
    const playerId = req.body.playerId;
    const userId = req.body.userId;
    const buyQuantity = req.body.quantity;
    let player = await Player.findOne({ playerId: req.body.playerId });
    if (!player) {
      return res.status(403).json({ msg: "Inavalid playerId" });
    }
    if (player.quantity === 0) {
      return res
        .status(403)
        .json({ msg: player.playerId + " is out of stock" });
    }
    if (player.quantity - buyQuantity < 0) {
      return res.status(403).json({
        msg: "Only " + player.quantity + " available for " + playerId,
      });
    }
    let user = await User.findOne({ userId: userId });
    if (user.quantity - buyQuantity < 0) {
      return res
        .status(403)
        .json({ msg: "Only " + user.quantity + " available for " + userId });
    }

    let trade = new Trade({
      playerId: playerId,
      userId: userId,
      quantity: buyQuantity,
      type: 1,
    });
    let player1 = await Player.updateOne(
      { playerId: playerId },
      { $set: { quantity: player.quantity - buyQuantity } }
    );
    let user1 = await User.updateOne(
      { userId: userId },
      { $set: { quantity: user.quantity - buyQuantity } }
    );
    trade.save(async (error, trade) => {
      if (error) {
        console.log(error);
      } else {
        let alreadyPurcahsed = await User.findOne({ userId: userId }).select({
          purchasedPlayers: { $elemMatch: { playerId: playerId } },
        });
        console.log(alreadyPurcahsed);
        if (alreadyPurcahsed.purchasedPlayers.length) {
          await User.updateOne(
            { "purchasedPlayers.playerId": playerId },
            {
              $set: {
                "purchasedPlayers.$.quantity":
                  alreadyPurcahsed.purchasedPlayers[0].quantity + buyQuantity,
              },
            }
          );
        } else {
          await User.updateOne(
            { userId: userId },
            {
              $push: {
                purchasedPlayers: { playerId: playerId, quantity: buyQuantity },
              },
            }
          );
        }
        res.status(200).json({ trade });
      }
    });
  } catch (error) {
    return res.status(405).json(error);
  }
});

/* Sell */
router.post("/sell", async (req, res, next) => {
  try {
    const playerId = req.body.playerId;
    const userId = req.body.userId;
    const sellQuantity = req.body.quantity;
    let player = await Player.findOne({ playerId: req.body.playerId });
    if (!player) {
      return res.status(403).json({ msg: "Inavalid playerId" });
    }

    let alreadyPurcahsed = await User.findOne({ userId: userId }).select({
      purchasedPlayers: { $elemMatch: { playerId: playerId } },
    });

    if (!alreadyPurcahsed.purchasedPlayers.length) {
      return res.status(403).json({ msg: "You don't own this player" });
    }

    if (alreadyPurcahsed.purchasedPlayers[0].quantity - sellQuantity < 0) {
      return res
        .status(403)
        .json({ msg: "Quantity exceeded more than you own for this player" });
    }

    let player1 = await Player.updateOne(
      { playerId: playerId },
      { $set: { quantity: player.quantity + sellQuantity } }
    );

    let user = await User.findOne({ userId: userId });
    await User.updateOne(
      { userId: userId },
      { $set: { quantity: user.quantity + sellQuantity } }
    );

    let trade = new Trade({
      playerId: playerId,
      userId: userId,
      quantity: sellQuantity,
      type: 2,
    });
    trade.save(async (error, trade) => {
      if (error) {
        console.log(error);
      } else {
        if (
          alreadyPurcahsed.purchasedPlayers[0].quantity - sellQuantity ===
          0
        ) {
          await User.updateOne(
            { userId: userId },
            { $pull: { purchasedPlayers: { playerId: playerId } } }
          );
        } else {
          await User.updateOne(
            { "purchasedPlayers.playerId": playerId },
            {
              $set: {
                "purchasedPlayers.$.quantity":
                  alreadyPurcahsed.purchasedPlayers[0].quantity - sellQuantity,
              },
            }
          );
        }
        res.status(200).json({ trade });
      }
    });
  } catch (error) {
    return res.status(405).json(error);
  }
});

module.exports = router;
