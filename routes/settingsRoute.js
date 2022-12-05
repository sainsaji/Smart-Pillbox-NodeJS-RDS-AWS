const express = require('express');
const route = express.Router();

route.get('/settings', (req, res)=>{
    res.render('pages/settings',{
        title:"Settings",
    });
});

module.exports = route;