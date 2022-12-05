const express = require('express');
const route = express.Router();

route.post('/writeSchedule',(req, res) =>{
    var datetime = {
        scheduledtime: req.body.schedtime,
        scheduleddate: req.body.scheddate,
        repeat: req.body.repeat
    }
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
    console.log(getNowTime());


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
        for(var i = 0; i <schedDateArray.length;i++)
        {
            console.log("Insert into table set date: " + schedDateArray[i]+""+datetime.scheduledtime)
            
        };
    }
    const d1 = new Date(datetime.scheduleddate);
    var schedDateArray = []
    if (datetime.repeat==="true")
    {
        console.log("Repeat Enabled");   
        schedDateArray =getDateArray(datetime.scheduleddate, (d1.setDate(d1.getDate()+7)));
        
    }
    else
    {
        console.log("Repeat disabled");
        console.log(d1)
        schedDateArray.push(d1)
    }
    console.log("final array:",schedDateArray)
    queryPrinter(schedDateArray)
    res.redirect('/calendar')
})

module.exports = route;