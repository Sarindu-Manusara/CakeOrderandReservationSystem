import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    productType: {
      type: String,
      enum: ['cake', 'cookie', 'sweet', 'bakery'],
      required: true,
    },        
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    flavors: {
      type: [String],
      required: function () {
        return this.productType === 'cake';
      },
    },
    sizes: {
      type: [String],
      required: function () {
        return this.productType === 'cake';
      },
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 10,
    },
    isAvailable: {
      type: Boolean,
      required: true,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    weatherSensitive: {
      type: Boolean,
      default: false,
    },
    minimumStock: {
      type: Number,
      default: 5,
    },
    maximumStock: {
      type: Number,
      default: 50,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
