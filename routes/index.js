let express = require("express");
let router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");

/* GET home page. */

router.delete("/logout", function (req, res, next) {
  res.send({
    success: "OK",
    message: "Thisx is the index of this file.",
  });
});

module.exports = router;
