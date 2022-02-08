var express = require('express');
var router = express.Router();
var Blog = require('../models/blogs');
var Comment = require('../models/comments');
/* GET users listing. */

router.get('/', function (req, res, next) {
  Blog.find({}, (err, blogs) => {
    if (err) return next(err);
    res.render('blogsPage', { blogs: blogs });
  });
});
router.get('/new', function (req, res) {
  res.render('blogsForm');
});

router.get('/:slug', function (req, res, next) {
  var slug = req.params.slug;
  Blog.find({ slug: slug })
    .populate('comments')
    .exec((err, blog) => {
      if (err) return next(err);
      res.render('singleUser', { blog: blog });
    });
});

router.get('/:slug/edit', function (req, res, next) {
  var slug = req.params.slug;
  Blog.find({ slug }, (err, blog) => {
    if (err) return next(err);
    res.render('blogNewForm', { blog: blog });
  });
});
router.get('/:slug/delete', function (req, res, next) {
  var slug = req.params.slug;
  Blog.remove({ slug }, (err, blog) => {
    if (err) return next(err);
    Comment.deleteMany({ blogId: blog.id }, (err, info) => {
      res.redirect('/blog');
    });
  });
});

router.post('/', (req, res, next) => {
  Blog.create(req.body, (err, createArticle) => {
    if (err) return next(err);
    res.redirect('/blog');
  });
});
router.post('/:slug', (req, res, next) => {
  var slug = req.params.slug;
  Blog.findOneAndUpdate(slug, req.body, (err, updateBlog) => {
    if (err) return next(err);
    res.redirect('/blog/' + slug);
  });
});
router.post('/:slug/comments', (req, res, next) => {
  console.log(req.params);
  var slug = req.params.slug;
  req.body.blogId = slug;
  Comment.create(req.body, (err, comment) => {
    Blog.findOneAndUpdate(
      slug,
      { $push: { comments: comment._id } },
      (err, updatedBlog) => {
        console.log(err, updatedBlog);
        if (err) return next(err);
        res.redirect('/blog/' + slug);
      }
    );
  });
});
router.get('/:id/likes', (req, res, next) => {
  var id = req.params.slug;
  Blog.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, blog) => {
    console.log(err, blog);
    if (err) return next(err);
    res.redirect('/blog/' + id);
  });
});
router.get('/:id/dislikes', (req, res, next) => {
  var id = req.params.slug;
  Blog.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, blog) => {
    console.log(err, blog);
    if (err) return next(err);
    res.redirect('/blog/' + id);
  });
});
module.exports = router;