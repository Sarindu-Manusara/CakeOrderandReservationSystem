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
    console.log('📦 Fetching custom cakes for user:', req.user?._id);

    const customCakes = await CustomCake.find({ user: req.user._id });

    console.log('🎂 Found custom cakes:', customCakes.length);
    res.json(customCakes);
  } catch (error) {
    console.error('❌ Error in getCustomCakes:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all custom cakes (admin or management view)
// @route   GET /api/custom-cakes/all
// @access  Private (ideally with admin middleware)
const getAllCustomCakes = async (req, res) => {
  try {
    console.log('📦 Fetching ALL custom cakes');

    const customCakes = await CustomCake.find().populate('user', 'name email');

    console.log('🎂 Total custom cakes found:', customCakes.length);
    res.json(customCakes);
  } catch (error) {
    console.error('❌ Error in getAllCustomCakes:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteCustomCake = async (req, res) => {
  try {
    const customCake = await CustomCake.findById(req.params.id);

    if (!customCake) {
      return res.status(404).json({ message: 'Custom Cake not found' });
    }

    await customCake.deleteOne(); // <-- FIXED: use deleteOne instead of remove

    res.json({ message: 'Custom Cake removed successfully' });
  } catch (error) {
    console.error('❌ Error deleting Custom Cake:', error);
    res.status(500).json({ message: 'Server error while deleting Custom Cake' });
  }
};

// @desc    Update a custom cake
// @route   PUT /api/custom-cakes/:id
// @access  Private
const updateCustomCake = async (req, res) => {
  try {
    const customCake = await CustomCake.findById(req.params.id);

    if (!customCake) {
      return res.status(404).json({ message: 'Custom Cake not found' });
    }

    // Optional: Check if the logged-in user is the owner or admin
    if (String(customCake.user) !== String(req.user._id) && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this cake' });
    }

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

    // Update fields if provided
    if (size !== undefined) customCake.size = size;
    if (flavor !== undefined) customCake.flavor = flavor;
    if (frosting !== undefined) customCake.frosting = frosting;
    if (decorations !== undefined) customCake.decorations = decorations;
    if (message !== undefined) customCake.message = message;
    if (specialRequests !== undefined) customCake.specialRequests = specialRequests;
    if (price !== undefined) customCake.price = price;
    if (reservationDate !== undefined) customCake.reservationDate = reservationDate;

    const updatedCake = await customCake.save();
    res.json(updatedCake);
  } catch (error) {
    console.error('❌ Error updating Custom Cake:', error);
    res.status(500).json({ message: 'Server error while updating Custom Cake' });
  }
};




export {
  createCustomCake,
  getCustomCakes,
  getAllCustomCakes,
  deleteCustomCake,
  updateCustomCake
};