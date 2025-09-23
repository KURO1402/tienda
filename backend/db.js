require("dotenv").config();
const mysql = require('mysql2');

// Crear pool de conexiones para manejar múltiples requests
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});


// Promisify para usar async/await
const promisePool = pool.promise();

module.exports = promisePool;