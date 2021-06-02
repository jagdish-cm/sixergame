var mongoose = require("mongoose");

var playerSchema = mongoose.Schema({
  playerId: {
    type: String,
    unique: true,
    required: true,
  },
  quantity: {
    type: Number,
    default : 100
  },
});


var Player = (module.exports = mongoose.model("Player", playerSchema));
