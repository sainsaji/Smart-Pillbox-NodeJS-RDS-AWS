const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyparser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 4000;

const connection = mysql.createConnection({
    host:"testdb.cergfpiaziwa.us-east-1.rds.amazonaws.com",
    user:"admin",
    password:"12345678",
    // database:"covid19",
    port:"3306",
    connectionLimit: 15,
    queueLimit: 30,
    acquireTimeout: 1000000
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('DB connection established');
});

app.get('/',(req, res)=>{
    let sql = "CREATE DATABASE IF NOT EXISTS  spb;"
    let starterquery = connection.query(sql,(err,rows)=>{
        if(err) throw err;
        console.log("DATABASE create query run");
    });
});

app.listen(port,()=>{
    console.log('Smart Pill Box is running on port:',port)
})