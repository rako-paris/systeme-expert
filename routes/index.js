var express 	= require('express');
var router 		= express.Router();
var answer 		      = require('./answer');




router.use('/answer', answer);


module.exports = router;
