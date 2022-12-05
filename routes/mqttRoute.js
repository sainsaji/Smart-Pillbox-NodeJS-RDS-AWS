const express = require('express');
const route = express.Router();

route.get('/mqtt', (req, res)=>{
    res.render('pages/mqtt',{
        title:"mqtt",
    });
});

module.exports = route;