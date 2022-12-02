const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const hostconfig = require('./config/host-config');
const dbconfig = require('./config/db-config');

const port = hostconfig.port;

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
    res.render('pages/dashboard',{
        title:"Dashboard"
    });
});

app.get('/tests', (req, res)=>{
    res.render('pages/tests',{
        title:"Test"
    });
});

app.get('/schedule', (req, res)=>{
    res.render('pages/schedule',{
        title:"Schedule Pills"
    });
});


app.get('/calendar', (req, res)=>{
    res.render('pages/calendar',{
        title:"Calendar"
    });
});

app.get('/mqtt', (req, res)=>{
    res.render('pages/mqtt',{
        title:"MQTT Logs"
    });
});

app.get('/settings', (req, res)=>{
    res.render('pages/settings',{
        title:"Settings",
    });
});

app.listen(port,()=>{
    console.log('Smart Pill Box is running on port:',port)
})