var express = require('express');
var router = express.Router();
var getUsers = require('./../routes/data');
/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(getUsers())
  res.send(getUsers());
});

module.exports = router;
