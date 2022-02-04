var express = require('express');
var router = express.Router();
var User = require('../models/User');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('users');
});

router.get('/register', (req, res, next) => {
  res.render('register');
});
router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    console.log(err, user)
    res.redirect('/users/register');
  });
});
// router.get('/login', (req, res, next) => {
//   res.render('login');
// });
module.exports = router;