var mongoose = require("mongoose");
var Player = require("../models/player");
var User = require("../models/user");

var tradeSchema = mongoose.Schema({
  playerId: { type: String, required: true },
  userId: { type: String, required: true },
  quantity: { type: Number, required: true },
  type: { type: Number, required: true },
});

var Trade = (module.exports = mongoose.model("Trade", tradeSchema));
