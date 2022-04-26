const mysql = require("mysql2/promise");
const { logger } = require("./winston");


const pool = mysql.createPool({
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'mapserver'
});


module.exports = {
  pool: pool,
};
