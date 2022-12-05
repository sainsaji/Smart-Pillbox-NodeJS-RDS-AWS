const express = require('express');
const route = express.Router();

route.get('/schedule', (req, res)=>{
    res.render('pages/schedule',{
        title:"Schedule Pills"
    });
});

module.exports = route;