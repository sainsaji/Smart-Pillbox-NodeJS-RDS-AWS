const express = require('express');
const route = express.Router();
const mysql = require('mysql');
const dbconfig = require('../config/db-config');
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

route.get('/setter',(req, res)=>{
    // let sql0 = "DROP DATABASE spb;"
    // let starterquery0 = connection.query(sql0,(err,rows)=>{
    //     if(err) throw err;
    //     console.log("DATABASE drop query run");
    // });

    let sql = "CREATE DATABASE IF NOT EXISTS  spb;"
    let starterquery = connection.query(sql,(err,rows)=>{
        if(err) throw err;
        console.log("DATABASE create query run");
    });
    let sql0 = "drop table spbtable;"
    let starterquery0 = connection.query(sql,(err,rows)=>{
        if(err) throw err;
        console.log("Drop spb table");
    });
    let sql01 = "drop table testtable;"
    let starterquery01 = connection.query(sql,(err,rows)=>{
        if(err) throw err;
        console.log("Drop tests table");
    });

    let sql2 ="CREATE TABLE IF NOT EXISTS ?? (ID int AUTO_INCREMENT NOT NULL,patientname VARCHAR(255),caretaker VARCHAR(255),pillname varchar(255),pilldesc varchar(255),caretakernum varchar(255),start_time varchar(255),start_date varchar(255),schedulestatus boolean not null default 0 ,PRIMARY KEY(ID))";
    let tablestarterquery = connection.query(sql2,[spbtable],(err,rows)=>{
        if(err) throw err;
        console.log("create table query run");
    });

    let sql3 = "CREATE TABLE IF NOT EXISTS ?? (ID int AUTO_INCREMENT NOT NULL,patientname VARCHAR(255),caretaker VARCHAR(255),pillname varchar(255),pilldesc varchar(255),caretakernum varchar(255),start_time varchar(255),start_date varchar(255),schedulestatus boolean not null default 0 ,PRIMARY KEY(ID))"
    let testtablequery = connection.query(sql3,["testtable"],(err,rows)=>{
        if(err) throw err;
        console.log("create test table query run");
    });

    let sql4 = "CREATE TABLE IF NOT EXISTS ?? (ID int AUTO_INCREMENT NOT NULL,patientname VARCHAR(255),caretaker VARCHAR(255),pillname varchar(255),pilldesc varchar(255),caretakernum varchar(255),start_time varchar(255),start_date varchar(255),schedulestatus boolean not null default 0 ,PRIMARY KEY(ID))"
    let allSchedules = connection.query(sql3,["scheduletable"],(err,rows)=>{
        if(err) throw err;
        console.log("Main Schedule Created");
    });

});

module.exports = route;