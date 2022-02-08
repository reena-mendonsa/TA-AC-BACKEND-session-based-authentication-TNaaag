var express = require('express');
var router = express.Router();
var User = require('../models/user');


/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(req.session);
  res.render('logged');
});
router.get('/register', function (req, res, next) {
  res.render('register');
});
router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    res.redirect('/users/login');
  });
});
router.get('/login', function (req, res, next) {
  //res.render('login');
  var error = req.flash('error')[0];
      res.render('login',{error})
});
router.get('/loginSuccess', function (req, res, next) {
  let email = req.session.email;
  User.findOne({ email }, (err, user) => {
    var fullName = user.fullName();
    res.render('loginSuccess', { fullName });
  });
});
router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      
     req.flash('error', 'This email is not registered!');  
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      console.log(result);
      if (!result) {
        console.log(password);
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      req.session.email = user.email;
      res.redirect('/users/loginSuccess');
    });
  });
});

// logout

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
});
module.exports = router;