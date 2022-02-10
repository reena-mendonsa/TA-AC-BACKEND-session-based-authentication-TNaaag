var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Product = require('../models/Product');


// 

// SignUp

router.get('/signup', (req, res, next) => {
  var error = req.flash('error')[0];
  res.render('signup', { error });
});

router.post('/signup', (req, res, next) => {
  var data = req.body;
  console.log(data);
  User.create(data, (err, user) => {
    // if (err) return next(err);
    if (err) {
      if (err.code === 11000) {
        req.flash('error', 'This email is already registered...');
        return res.redirect('/users/signup');
      }
      if (err.name === 'ValidationError') {
        req.flash('error', err.message);
        return res.redirect('/users/signup');
      }
    } else {
      return res.redirect('/users/signin');
    }
  });
});

// Dashboard
router.get('/dashboard', (req, res, next) => {
  var id = req.session.userId;
  console.log(id, 'hyyy');
  User.findById(id, (err, user) => {
    if (err) return next(err);
    res.render('dashboard', { user });
  });
});

// SignIn
router.get('/signin', (req, res, next) => {
  var error = req.flash('error')[0];
  res.render('signin', { error });
});

router.post('/signin', (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Email or Password is missing...');
    return res.redirect('/users/signin');
  }

  User.findOne({ email: email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error', 'Not registered...');
      return res.redirect('/users/signin');
    }

    user.verifyPassword(password, (err, result) => {
      if (!result) {
        req.flash('error', 'Password is wrong...');
        return res.redirect('/users/signin');
      }
      //  Persist Logged In User
      req.session.userId = user._id;
      res.redirect('/users/dashboard');
    });
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/signin');
});

module.exports = router;