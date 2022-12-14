const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const hostconfig = require('./config/host-config');
const dbconfig = require('./config/db-config');
const port = process.env.PORT || 4000;
const { auth, requiresAuth } = require('express-openid-connect');
require('dotenv').config();

var spbtable = "spbtable";

//auth

app.use(
    auth({
        authRequired: false,
        auth0Logout: true,
        issuerBaseURL: process.env.ISSUER_BASE_URL,
        baseURL: process.env.BASE_URL,
        clientID: process.env.CLIENT_ID,
        secret: process.env.SECRET,
    })
);


//Routes Set-up
app.get('/profile',requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});
const dashboardRoute = require('./routes/dashboardRoute');
const calenderRoute = require('./routes/calenderRoute');
const mqttRoute = require('./routes/mqttRoute');
const scheduleRoute = require('./routes/scheduleRoute');
const setterRoute = require('./routes/setterRoute');
const settingsRoute = require('./routes/settingsRoute');
const testsRoute = require('./routes/testsRoute');
const writeRoute = require('./routes/writeRoute');



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


//Route Use
app.use(dashboardRoute);
app.use(setterRoute);  //call using /setter
app.use(settingsRoute);
app.use(mqttRoute);
app.use(testsRoute);
app.use(scheduleRoute);
app.use(calenderRoute);
app.use(writeRoute);


app.listen(port,()=>{
    console.log('Smart Pill Box is running on port:',port)
})