const createError = require("http-errors");
const cors = require("cors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const pesananRouter = require("./routes/pesanan");
const kelasRouter = require("./routes/kelas");
const coursesRouter = require("./routes/courses");
const authRouter = require("./routes/auth");

const bodyParser = require("body-parser");
const verifyToken = require("./middleware/verifyToken");

let app = express();
// logger, cookies setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
// define the routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/users", verifyToken, usersRouter);
app.use("/pesanan", pesananRouter);
app.use("/kelas", kelasRouter);
app.use("/courses", coursesRouter);


// error handler
const ErrorHandler = (err, req, res, next) => {
  console.log("Error Handling");
  console.log("status code:", err.statusCode);
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || "Something went wrong";
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};

app.use(function (req, res, next) {
  next(createError(404));
});
app.use(ErrorHandler);

module.exports = app;
