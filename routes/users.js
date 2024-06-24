var express = require("express");
var router = express.Router();
const db = require("../db");
const verifyToken = require("../middleware/verifyToken");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();
const { body, validationResult } = require("express-validator");

const config = {
  secret: env.parsed.SECRET,
};
router.get("/profile", async function (req, res, next) {
  const tokenHeader = req.headers["authorization"];
  const accessToken = tokenHeader.split(" ")[1];
  const payload = jwt.verify(accessToken, config.secret);
  let id = payload.userId;
  let data = {};
  row = await db.query(`
  SELECT 
  id_pengguna, 
  email,
  nama,
  jenis_kelamin,
  nomor_wa,
  no_rek,
  alamat,
  tempat_lahir,
  DATE_FORMAT(tanggal_lahir,'%Y-%m-%d') as tanggal_lahir,
  nama_bank
  from pengguna where id_pengguna=${id} LIMIT 1
    `);
  data.user = row[0];
  data.rating = await db.query(`
  SELECT r.rating, r.description as text, s.nama as name from pengguna as p 
  INNER JOIN rating as r ON p.id_pengguna = r.id_guru
  INNER JOIN siswa as s ON r.id_siswa = s.id_murid
  where p.id_pengguna=${id} 
    `);

  res.send({
    success: "OK",
    id: req.params.id,
    data: data,
  });
});

router.post(
  "/profile",
  [
    body("jenis_kelamin").notEmpty().withMessage("Jenis Kelamin is required"),
    body("nomor_wa").notEmpty().withMessage(" Nomor Wa is required"),
    body("no_rek").notEmpty().withMessage(" No REK is required"),
    body("tempat_lahir").notEmpty().withMessage(" Tempat Lahir is required"),
    body("tanggal_lahir").notEmpty().withMessage(" Tanggal Lahir is required"),
    body("alamat").notEmpty().withMessage("Alamat is required"),
    body("nama_bank").notEmpty().withMessage("Nama Bank is required"),
    body("email").isEmail().notEmpty().withMessage("Email is required"),
    body("nama").notEmpty().withMessage("Nama is invalid"),
  ],
  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const tokenHeader = req.headers["authorization"];
    const accessToken = tokenHeader.split(" ")[1];
    const payload = jwt.verify(accessToken, config.secret);
    let id = payload.userId;

    const {
      jenis_kelamin,
      nomor_wa,
      no_rek,
      tempat_lahir,
      tanggal_lahir,
      alamat,
      email,
      nama,
      nama_bank,
    } = req.body;
    const sql = `
    UPDATE pengguna
    SET 
    jenis_kelamin = ?,
    nomor_wa = ?,
    no_rek = ?,
    tempat_lahir = ?,
    tanggal_lahir = ?,
    alamat = ?,
    email = ?,
    nama = ?,
    nama_bank = ?
    WHERE id_pengguna = ?
    `;

    const values = [
      jenis_kelamin,
      nomor_wa,
      no_rek,
      tempat_lahir,
      tanggal_lahir,
      alamat,
      email,
      nama,
      nama_bank,
      id,
    ];

    const result = await db.query(sql, values);

    return res.status(200).json({
      success: "OK",
    });
  },
);
module.exports = router;
