var express = require("express");
var router = express.Router();
const db = require("../db")
// const verifyToken = require("../middleware/verifyToken")

console.log()
/* GET users listing. */
router.get("/", async function (req, res, next) {
  const rows = await db.query(`
    SELECT 
    id,
    description,
    title,
    price
    FROM 
    courses;
    `);
  res.send({
    success: 'OK',
    data: rows
  });
});

router.get("/:id", async function (req, res, next) {
  console.log(req.params.id)
  rows = await db.query(`
    SELECT 
    p.nama as name,
    p.about,
    c.detail_class,
    p.nomor_wa as wa_number,
    p.email as email
    FROM courses as c
    INNER JOIN pengguna as p ON c.id_guru = p.id_pengguna
    WHERE c.id = ${req.params.id};
    `)
  res.send({
    success: "OK",
    data: rows[0]
  });
});
module.exports = router;
