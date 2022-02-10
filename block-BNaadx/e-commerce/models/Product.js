var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    image: { type: String },
    likes: { type: Number, default: 0 },
    comments: [{ type: String, ref: 'Comment' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);