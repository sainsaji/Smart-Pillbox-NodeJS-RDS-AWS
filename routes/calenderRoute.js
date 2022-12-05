const express = require('express');
const route = express.Router();
const dbconfig = require('../config/db-config');
const mysql = require('mysql');
var spbtable = "spbtable";

const connection = mysql.createConnection({
    host:dbconfig.host,
    user:dbconfig.user,
    password:dbconfig.password,
    database:dbconfig.database,
    port:dbconfig.port,
    connectionLimit: dbconfig.connectionLimit,
    queueLimit: dbconfig.queueLimit,
    acquireTimeout: dbconfig.acquireTimeout
});

route.get('/calendar', (req, res)=>{
    let sql = "SELECT * FROM ??";
    let query = connection.query(sql,[spbtable],(err,rows,res1)=>{
        if(err) throw err;
    res.render('pages/calendar',{
        title:"Schedule List",
        schedulelist : rows
    });
});
});

route.get('/clearSchedule', (req, res)=>{
    let sql = "TRUNCATE TABLE ??;";
    let query = connection.query(sql,[spbtable],(err,rows,res1)=>{
        if(err) throw err;
    res.render('pages/calendar',{
        title:"Schedule List",
        schedulelist : rows
    });
    res.redirect('back');
});
});
module.exports = route;