const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 4000;

var spbtable = "spbtable";

const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"spb",
    port:"3306",
    connectionLimit: 15,
    queueLimit: 30,
    acquireTimeout: 1000000
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('DB connection established');
});

app.use(express.static(path.join(__dirname,'static')));
//Setting Up View Engine
app.set('views',path.join(__dirname, 'views'));
app.set('content',path.join(__dirname, 'views/content'));
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/setter',(req, res)=>{
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

app.get('/', (req, res)=>{
    res.render('dashboard',{
        title:"Dashboard"
    });
});

app.get('/tests', (req, res)=>{
    res.render('pages/tests',{
        title:"Test"
    });
});

app.get('/schedule', (req, res)=>{
    res.render('schedule',{
        title:"Schedule Pills"
    });
});


app.get('/calendar', (req, res)=>{
    res.render('calendar',{
        title:"Calendar"
    });
});

app.get('/mqtt', (req, res)=>{
    res.render('mqtt',{
        title:"MQTT Logs"
    });
});

app.get('/settings', (req, res)=>{
    res.render('settings',{
        title:"Settings"
    });
});

app.listen(port,()=>{
    console.log('Smart Pill Box is running on port:',port)
})