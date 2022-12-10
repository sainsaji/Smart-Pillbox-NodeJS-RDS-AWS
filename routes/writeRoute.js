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


route.post('/writeSchedule',(req, res) =>{
    var data = {
        patientname: "test",
        caretaker : "test",
        caretakernum: 9000000000,
        pillname: req.body.pillname,
        pilldesc : req.body.pilldesc,
        start_time: req.body.schedtime,
        start_date: req.body.scheddate,
        schedulestatus:"0",
    }
    var repeat = req.body.repeat
    const date = new Date();
    function getNowDate() {
        let day = date.getDate().toString().padStart(2, "0");;
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        // This arrangement can be altered based on how we want the date's format to appear.
        let currentDate = `${year}-${month}-${day}`;
        return currentDate;
    }
    function getNowTime() {
        const currentTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        return currentTime;
    }
    console.log(getNowDate());
   


    function dateRange(startDate, endDate, steps = 1) {
        const dateArray = [];
        let currentDate = new Date(startDate);
      
        while (currentDate <= new Date(endDate)) {
          dateArray.push(new Date(currentDate));
          // Use UTC date to prevent problems with time zones and DST
          currentDate.setUTCDate(currentDate.getUTCDate() + steps);
        }
      
        return dateArray;
      }
      var getDateArray = function(start, end) {
        var arr = new Array();
        var dt = new Date(start);
        while (dt <= end) {
            arr.push(new Date(dt));
            dt.setDate(dt.getDate() + 1);
        }
        return arr;
    }
    function queryPrinter(schedDateArray)
    {
        let sql = "INSERT INTO ?? SET ?";
        for(var i = 0; i <schedDateArray.length;i++)
        {
            data.start_date = schedDateArray[i];
            let insQuery = connection.query(sql,[spbtable,data],(err,results)=>{
                if(err) throw err
                else console.log("insert sucess");
        });
        
    }
    }
    const d1 = new Date(data.start_date);
    var schedDateArray = []
    if (repeat==="true")
    {
        console.log("Repeat Enabled");   
        schedDateArray =getDateArray(data.start_date, (d1.setDate(d1.getDate()+7)));
        
    }
    else
    {
        console.log("Repeat disabled");
        console.log(d1)
        schedDateArray.push(d1)
    }
    console.log("final array:",schedDateArray)
    queryPrinter(schedDateArray)
    res.redirect('/calendar');
    
})

module.exports = route;