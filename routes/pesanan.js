var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db");
const verifyToken = require("../middleware/verifyToken");
const env = require("dotenv").config();
const config = {
  secret: env.parsed.SECRET,
};

/* GET home page. */
/**Authenticated get pesanan */
// router.get("/", async function (req, res, next) {
//   const tokenHeader = req.headers["authorization"];
//   const accessToken = tokenHeader.split(" ")[1];
//   const payload = jwt.verify(accessToken, config.secret);
//   let id = payload.userId;
//   [user] = await db.query(`
//   SELECT * from pengguna where id_pengguna=${id} LIMIT 1
//     `);

//   const rows = await db.query(`
//   select p.id_pesanan as id, s.nomor_ponsel as phone, s.nama as name, p.status as status, p.sesi as sessionsPerDay, CONCAT(p.sesi_bulan," ", "Bulan") as duration
//   from pesanan as p
//     INNER JOIN pengguna as g ON p.id_guru = g.id_pengguna
//     INNER JOIN siswa as s ON p.id_murid = s.id_murid
//   WHERE g.id_pengguna = ${user.id_pengguna}`);
//   res.send({
//     success: "OK",
//     data: rows,
//   });
// });

router.get("/", async function (req, res, next) {
  const rows = await db.query(`
  SELECT 
  p.id_pesanan AS id, 
  s.nomor_ponsel AS phone, 
  s.nama AS name, 
  p.status AS status,
  p.description,
  p.sesi AS sessionsPerDay, 
  CONCAT(p.sesi_bulan, ' Bulan') AS duration,
  p.metode_pembayaran AS metodepembayaran,
  DATE_FORMAT(p.tanggal_pembayaran, '%Y-%m-%d') AS date,
  YEAR(p.tanggal_pembayaran) AS year,
  p.sesi as month
FROM pesanan AS p
INNER JOIN pengguna AS g ON p.id_guru = g.id_pengguna
INNER JOIN siswa AS s ON p.id_murid = s.id_murid;`);
  res.send({
    success: "OK",
    data: rows,
  });
});

router.post("/:id", async function (req, res, next) {
  const id_murid = req.params.id;
  const { status_kelas, sesi, id_guru, diterima, id_kelas } = req.body;

  let row = {};
  const sql =
    "INSERT INTO pesanan (id_murid, status, sesi, id_guru, diterima, id_kelas) VALUES (?, ?, ?, ?, ?, ?)";

  const values = [id_murid, status_kelas, sesi, id_guru, diterima, id_kelas];

  row = await db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
  });
  res.send({
    success: "OK",
  });
});
router.delete("/:id", async function (req, res, next) {
  const id_pesanan = req.params.id;

  const sql = `DELETE FROM pesanan WHERE id_pesanan = ?`;

  const values = [id_pesanan]

  row = await db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
  });
  res.send({
    success: "OK",
  });
});

module.exports = router;
