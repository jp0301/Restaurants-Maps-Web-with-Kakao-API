const express = require("./config/express");
const mysql = require("mysql2/promise");
const { logger } = require("./config/winston"); // log


const port = 3001;
var app = express()

express().listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);

/*
app.get('/main', function(req,res) {
    res.sendFile(__dirname + "/public/index.html")
})
*/ 
//app.use(express.static('public'))

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mapserver'
});

module.exports = { pool };