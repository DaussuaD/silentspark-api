let express = require("express");
let router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const env = require("dotenv").config();
const config = {
  secret: env.parsed.SECRET,
};
// const { check, validationResult } = require("express-validator/check");

/* GET home page. */

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email is invalid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    const { email, password } = req.body;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Check if email is unique
      const [user] = await db.query(`SELECT * FROM pengguna WHERE email = ?`, [
        email,
      ]);

      if (!user) {
        return res.status(401).json({
          success: "NO",
          message: "Email tidak ditemukan.",
        });
      }
      bcrypt.compare(password, user.password, (err, data) => {
        // console.log(password, user.password)
        //if error than throw error
        // console.log(err)
        // if (err) throw err;

        console.log("data:", data);
        //if both match than you can do anything
        if (data) {
          let token;
          try {
            token = jwt.sign(
              {
                userId: user.id_pengguna,
                email: user.email,
              },
              config.secret,
              { expiresIn: "365d" },
            );
          } catch (err) {
            return next(new Error(err));
          }

          res.status(201).json({
            success: "OK",
            email: user.email,
            user: user,
            token: token,
          });
        } else {
          return res.status(401).json({
            success: "NO",
            message: "Password yang anda masukkan salah.",
          });
        }
      });
    } catch (err) {
      return res.status(500).json({
        error: err.message,
        message: "Terdapat kesalahan pada server.",
      });
    }
  },
);

router.post(
  "/register",
  [
    body("nama").notEmpty().withMessage("Nama is required"),
    body("email").isEmail().withMessage("Email is invalid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async function (req, res, next) {
    // validate body parameters
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { nama, email, password } = req.body;

    try {
      // Check if email is unique
      const [unique] = await db.query(
        `SELECT * FROM pengguna WHERE email = ?`,
        [email],
      );

      if (unique) {
        return res.status(401).json({
          success: "NO",
          message: "Email " + email + " telah digunakan.",
          user: unique,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // console.log(nama, email, password);
      // Insert to the database
      const sql =
        "INSERT INTO pengguna (nama, email, password) values (?, ?, ?)";
      const values = [nama, email, hashedPassword];

      const result = await db.query(sql, values);
      const newUser = { id: result.insertId, email: email };

      let token;
      try {
        token = jwt.sign(
          {
            userId: newUser.id,
            email: newUser.email,
          },
          "secretkeyappearshere",
          { expiresIn: "365d" },
        );
      } catch (err) {
        return next(new Error("Error! Something went wrong."));
      }

      res.status(201).json({
        success: "OK",
        userId: newUser.id,
        email: newUser.email,
        token: token,
      });
    } catch (err) {
      return res.status(500).json({
        error: err.message,
        message: "Gagal menambahkan pengguna ke database.",
      });
    }
  },
);

router.delete("/logout", function (req, res, next) {
  res.send({
    success: "OK",
    message: "Thisx is the index of this file.",
  });
});

module.exports = router;
