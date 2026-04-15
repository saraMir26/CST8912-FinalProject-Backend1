const sql = require("mssql");

const config = {
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

async function getConnection() {
  return await sql.connect(config);
}

module.exports = { sql, getConnection };