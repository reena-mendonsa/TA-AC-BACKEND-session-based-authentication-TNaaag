var mongoose = require('mongoose');
var Schema = mongoose.Schema;

varcommentSchema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: String, required: true },
    likes: { type: Number, default: 0 },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);