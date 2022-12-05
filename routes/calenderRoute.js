const express = require('express');
const route = express.Router();

route.get('/calendar', (req, res)=>{
    res.render('pages/calendar',{
        title:"Calendar"
    });
});
module.exports = route;