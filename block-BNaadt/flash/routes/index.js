var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// success page

router.get('/dashboard', function (req, res, next) {
  console.log(req.session);
  res.render('successfullLogin');
});

module.exports = router;