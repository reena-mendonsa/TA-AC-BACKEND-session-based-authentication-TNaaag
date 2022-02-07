var express = require('express');
var router = express.Router();
var User = require('../model/User');
var bcrypt = require('bcrypt');


router.get('/', function (req, res, next) {
  res.render('users');
});

/* GET users listing. */

router.get('/register', (req, res, next) => {
  res.render('registerUser')
});

// user login 

router.get("/login", (req, res, next) => {
  res.render('loginUser')
});

// login

router.post("/login", (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
   return res.redirect("/users/login");
  }
  User.findOne({ email }, (err, user) => {
    console.log(err, user, 'user');

    if (err) return next(err);
    
    // no user
    if (!user) {
    return  res.redirect('/users/login');
    }
    // compare password

    user.verifyPassword(password, (err, result) => {
      console.log(err, result, 'result');
      if (err) return next(err);
      if (!result) {
      return res.redirect('/users/login');
      }

      // persist logged in user information
      req.session.userId = user._id;
      res.redirect("/dashboard")

    });
  })
})


// register 

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    console.log(err, user)
    if (err) return next(err);
    res.redirect('/users/login')
  })
});
 


module.exports = router;