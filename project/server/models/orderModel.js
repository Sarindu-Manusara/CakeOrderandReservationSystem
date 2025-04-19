import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        isCustom: { type: Boolean, default: false },
        customOptions: {
          size: { type: String },
          flavor: { type: String },
          frosting: { type: String },
          decorations: [String],
          message: { type: String },
        },
        reservationDate: { type: Date },
        cake: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Cake',
        },
        customCake: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'CustomCake',
        },
      },
    ],
    shippingAddress: {
      address: { 
        type: String,
        required: function() { return !this.isReservation; }
      },
      city: { 
        type: String,
        required: function() { return !this.isReservation; }
      },
      postalCode: { 
        type: String,
        required: function() { return !this.isReservation; }
      },
      country: { 
        type: String,
        required: function() { return !this.isReservation; }
      },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    isReservation: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;