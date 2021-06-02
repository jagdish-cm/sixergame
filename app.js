var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");

var playerRouter = require("./routes/player");
var usersRouter = require("./routes/users");
var tradeRouter = require("./routes/trades");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// connnect Mongodb
mongoose.connect(
  "mongodb+srv://jcm:ramram@cluster0.j9nm3.mongodb.net/sixer?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
let db = mongoose.connection;
// Check connections
db.once("open", function () {
  console.log("Connected to MongoDB");
});
// Check for error
db.on("error", function (err) {
  console.log(err);
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/player", playerRouter);
app.use("/user", usersRouter);
app.use("/trade", tradeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
