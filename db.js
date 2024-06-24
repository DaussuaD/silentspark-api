const mysql = require("mysql2/promise");
const env = require("dotenv").config();

const config = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: env.parsed.DB_HOST,
    user: env.parsed.DB_USER,
    password: env.parsed.DB_PASS,
    database: env.parsed.DB_NAME,
    connectTimeout: 6000,
  },
  // listPerPage: 10,
};

async function query(sql, params) {
  const connection = await mysql.createConnection(config.db);
  const [results] = await connection.execute(sql, params);

  return results;
}

module.exports = {
  query,
};
