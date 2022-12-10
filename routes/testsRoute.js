const express = require('express');
var moment = require('moment'); // require
const route = express.Router();
const dbconfig = require('../config/db-config');
const mysql = require('mysql');
var spbtable = "spbtable";

moment().format();

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

route.get('/tests', (req, res)=>{
    res.render('pages/tests',{
        title:"Test"
    });
});

route.post('/writeTest', (req, res)=>{
    function getAddedTime()
    {
        const time2 = moment(new Date);
        time2.add(1, "minutes");
        return time2.format("hh:mm:ss");
    }
    var data = {
        patientname: "test",
        caretaker : "test",
        caretakernum: 9000000000,
        pillname: "test",
        pilldesc : "test",
        start_time: getAddedTime(),
        start_date: moment().format("DD MM YYYY"),
        schedulestatus:"0",
    }
    console.log(data);
    function dropALL()
    {
        let sql = "TRUNCATE TABLE ??";
        
        let insQuery = connection.query(sql,["testtable"],(err,results)=>{
            if(err) throw err
            else console.log("clearing previous test cases");
        });
        

    }
    function queryPrinter()
    {
        let sql = "INSERT INTO ?? SET ?";
        
            let insQuery = connection.query(sql,["testtable",data],(err,results)=>{
                if(err) throw err
                else console.log("inserting test query sucess");
            });
            res.redirect('/tests');
        
    }
    dropALL();
    queryPrinter();
});

module.exports = route;