const express = require('express');
const route = express.Router();

route.get('/setter',(req, res)=>{
    let sql = "CREATE DATABASE IF NOT EXISTS  spb;"
    let starterquery = connection.query(sql,(err,rows)=>{
        if(err) throw err;
        console.log("DATABASE create query run");
    });

    let sql2 ="CREATE TABLE IF NOT EXISTS ?? (ID int AUTO_INCREMENT NOT NULL,patientname VARCHAR(255),caretaker VARCHAR(255),caretakernum int(11),start_date timestamp,schedulestatus boolean not null default 0 ,PRIMARY KEY(ID))";
    let tablestarterquery = connection.query(sql2,[spbtable],(err,rows)=>{
        if(err) throw err;
        console.log("create table query run");
    });

});

module.exports = route;