var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1000,
  },
  purchasedPlayers : [{
    playerId : String,
    quantity : Number
  }]
});

var User = (module.exports = mongoose.model("User", userSchema));
