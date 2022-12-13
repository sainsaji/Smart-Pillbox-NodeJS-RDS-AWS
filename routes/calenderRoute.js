const express = require('express');
const route = express.Router();
const dbconfig = require('../config/db-config');
const mysql = require('mysql');
var spbtable = "spbtable";
const mqtt = require('mqtt')


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

//MQTT
const url = 'ws://broker.emqx.io:8083/mqtt'
const options = {
    // Clean session
    clean: true,
    connectTimeout: 4000,
    // Authentication
    clientId: 'emqx_testo',
    username: 'emqx_testo',
    password: 'emqx_testo',
  }


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

route.get('/scheduleNow', (req, res)=>{
    function mqttWrite()
    {   
        var mysqldata = ""
        function getData()
        {
            let sql = "SELECT start_time,start_date FROM ??";
            let query = connection.query(sql,["spbtable"],(err,rows,res1)=>{
                if(err) throw err;
                mysqldata = rows;
                
            }); 
        }
        getData();
        const client  = mqtt.connect(url, options)
        client.on('connect', function () {
            console.log('Connected')
            // Subscribe to a topic
            client.subscribe('test', function (err) {
              if (!err) {
                // Publish a message to a topic
                var sendString = JSON.stringify(mysqldata).replaceAll('"', '');
                var countOfSchedule = (sendString.match(/start_time/g) || []).length;
                sendString = sendString.replaceAll('start_time:','');
                sendString = sendString.replaceAll('start_date:','');
                sendString = sendString.replaceAll('[','');
                sendString = sendString.replaceAll(']','');
                sendString = sendString.replaceAll(',','');
                client.publish('test', countOfSchedule+sendString);
              }
            })
          })
        client.on('message', function (topic, message) {
        // message is Buffer
        console.log(message.toString())
        client.end()
        })
    }
    mqttWrite();
});
module.exports = route;