var express = require('express');
var User = require('../models/User');
var Product = require("../models/Product");
var router = express.Router();

router.get('/', function (req, res, next) {
  var id = req.session.userId;
  User.findById(id, (err, user) => {

    if (err) return next(err);
    if (user.isAdmin === 'true') {
      
      return res.render('productsAdmin', { user });
    } else if (user.isAdmin === 'false') {
      return res.render('productsUser', { user });
    }
  });
});

router.get('/add', (req, res, next) => {
  var id = req.session.userId;
  User.findById(id, (err, user) => {
    if (err) return next(err);
    if (user.isAdmin === 'true') {
      return res.render('addProduct', { user });
    }
  });
});

router.get('/adminView', function (req, res, next) {
  Product.find({}, (err, products) => {
    console.log(products);
    if (err) return next(err);
    return res.render('productDetailsAdmin', { products: products });
  });
});

//Add to cart
var cart = [];
router.get('/:id/addToCart', function (req, res, next) {
  var id = req.params.id;
  console.log(id,"ID");
  Product.findById(id, (err, product) => {
    if (err) return next(err);
    cart.push(product);
    console.log(cart);
    res.render('cart', { cart: cart });
  });
});

router.get('/:id/edit', function (req, res, next) {
  var id = req.params.id;
  var userId = req.session.userId
  console.log("Edit",userId);
    User.findById(userId, (err, user) => {

      if (err) return next(err);
      else{
        Product.findById(id, (err, product) => {
          if (err) return next(err);
          res.render('editProductNewForm', { userId,product: product });       
        });
        }
   
    
  });
});
router.get('/:id/delete', function (req, res, next) {
  var id = req.params.id;
  Product.findByIdAndDelete(id, (err, product) => {
    if (err) return next(err);
    // Comment.deleteMany({ productId: product.id }, (err, info) => {
      res.redirect('/products');
    // });
  });
});


router.post('/', (req, res, next) => {
  Product.create(req.body, (err, createdProduct) => {
    if (err) return next(err);
    res.redirect('/products/add');
  });
});

router.post('/:id', (req, res, next) => {
  var id = req.params.id;
  Product.findByIdAndUpdate(id, req.body, (err, updateproduct) => {
    console.log(err,updateproduct);
    if (err) return next(err);
    res.redirect('/products/');
    
  });
});

module.exports = router;