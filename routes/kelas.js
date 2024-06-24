var express = require("express");
var router = express.Router();
const db = require("../db")
// const verifyToken = require("../middleware/verifyToken")

console.log()
/* GET users listing. */
router.get("/", async function (req, res, next) {
  const rows = await db.query(`
    SELECT 
    id_kelas AS id, 
    nama AS title, 
    CASE WHEN description IS NOT NULL THEN description ELSE "-" END AS description, 
    status, 
    bulan 
    FROM 
    kelas;
    `);
  res.send({
    success: 'OK',
    data: rows
  });
});

router.get("/:id", async function (req, res, next) {
  rows = await db.query(`
    SELECT 
    id_kelas AS id, 
    nama AS title, 
    CASE WHEN description IS NOT NULL THEN description ELSE "-" END AS description, 
    status, 
    bulan,
    topics,
    linkzoom 
    FROM kelas
    WHERE id_kelas = ${req.params.id};
    `)
  res.send({
    success: "OK",
    data: rows[0]
  });
});
module.exports = router;
