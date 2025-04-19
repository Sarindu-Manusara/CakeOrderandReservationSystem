import CustomCake from '../models/customCakeModel.js';
import CartItem from '../models/cartModel.js';

// @desc    Create a custom cake
// @route   POST /api/custom-cakes
// @access  Private
const createCustomCake = async (req, res) => {
  try {
    const {
      size,
      flavor,
      frosting,
      decorations,
      message,
      specialRequests,
      price,
      reservationDate
    } = req.body;

    if (!price) {
      return res.status(400).json({ message: 'Price is required' });
    }

    const customCake = new CustomCake({
      user: req.user._id,
      size,
      flavor,
      frosting,
      decorations,
      message,
      specialRequests,
      price,
      reservationDate
    });

    const createdCake = await customCake.save();

    // Add to cart automatically
    const cartItem = new CartItem({
      user: req.user._id,
      customCake: createdCake._id,
      quantity: 1,
      isCustom: true,
      price: price, // Explicitly set the price
      customOptions: {
        size,
        flavor,
        frosting,
        decorations,
        message
      },
      reservationDate
    });

    await cartItem.save();

    res.status(201).json(createdCake);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user's custom cakes
// @route   GET /api/custom-cakes
// @access  Private
const getCustomCakes = async (req, res) => {
  try {
    const customCakes = await CustomCake.find({ user: req.user._id });
    res.json(customCakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createCustomCake,
  getCustomCakes
};