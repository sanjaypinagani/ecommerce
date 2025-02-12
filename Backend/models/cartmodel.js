const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    quantity: { type: Number, default: 1 }
  }],
  wishlist:[{
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }
    }]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
