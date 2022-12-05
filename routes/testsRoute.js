const express = require('express');
const route = express.Router();

route.get('/tests', (req, res)=>{
    res.render('pages/tests',{
        title:"Test"
    });
});

module.exports = route;