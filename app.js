const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyparser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 4000;

app.listen(port,()=>{
    console.log('Smart Pill Box is listening on port:',port)
})