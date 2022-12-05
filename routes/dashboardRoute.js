const express = require('express');
const route = express.Router();

route.get('/', (req, res)=>{
    res.render('pages/dashboard',{
        title:"Dashboard"
    });
});

module.exports = route;