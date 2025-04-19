import mongoose from 'mongoose';

const cartItemSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  cake: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cake',
  },
  customCake: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomCake',
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  isCustom: {
    type: Boolean,
    default: false,
  },
  customOptions: {
    size: String,
    flavor: String,
    frosting: String,
    decorations: [String],
    message: String,
  },
  price: {
    type: Number,
    required: true,
  },
  reservationDate: Date,
}, {
  timestamps: true,
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

export default CartItem;