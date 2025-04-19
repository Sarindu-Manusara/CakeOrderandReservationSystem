import mongoose from 'mongoose';

const customCakeSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  size: {
    type: String,
    required: true
  },
  flavor: {
    type: String,
    required: true
  },
  frosting: {
    type: String,
    required: true
  },
  decorations: [{
    type: String
  }],
  message: String,
  specialRequests: String,
  price: {
    type: Number,
    required: true
  },
  reservationDate: Date,
  isCustom: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const CustomCake = mongoose.model('CustomCake', customCakeSchema);

export default CustomCake;