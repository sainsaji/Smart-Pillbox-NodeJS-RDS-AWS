const express = require('express');
const route = express.Router();
const mysql = require('mysql');
const dbconfig = require('../config/db-config');
const { auth, requiresAuth } = require('express-openid-connect');
require('dotenv').config();

const connection = mysql.createConnection({
    host:dbconfig.host,
    user:dbconfig.user,
    password:dbconfig.password,
    database:dbconfig.database,
    port:dbconfig.port,
    connectionLimit: dbconfig.connectionLimit,
    queueLimit: dbconfig.queueLimit,
    acquireTimeout: dbconfig.acquireTimeout,
    multipleStatements: true
});

// route.get('/', (req, res)=>{
//     res.render('pages/dashboard',{
//         title:"Dashboard"
//     });
// });

route.get('/',requiresAuth(), (req, res)=>{
    let sql = "SELECT COUNT(ID)  as count FROM scheduletable;SELECT COUNT(ID)  as count FROM spbtable";
    let query = connection.query(sql,(err,rows,res1)=>{
        if(err) throw err;
        console.log(rows[0][0]);
        console.log(rows[1]);
    res.render('pages/dashboard',{
        title:"Dashboard",
        datax : rows[0][0],
        datay : rows[1][0]
    });
    });
});

module.exports = route;