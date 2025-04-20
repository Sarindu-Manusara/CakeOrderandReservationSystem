import Cake from '../models/cakeModel.js';

// @desc    Get all cakes
// @route   GET /api/cakes
// @access  Public
const getCakes = async (req, res) => {
  try {
    const cakes = await Cake.find({});
    res.json(cakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured cakes
// @route   GET /api/cakes/featured
// @access  Public
const getFeaturedCakes = async (req, res) => {
  try {
    const featuredCakes = await Cake.find({ featured: true });
    res.json(featuredCakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single cake by ID
// @route   GET /api/cakes/:id
// @access  Public
const getCakeById = async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (cake) {
      res.json(cake);
    } else {
      res.status(404).json({ message: 'Cake not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a cake
// @route   POST /api/cakes
// @access  Private/Admin
const createCake = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      price,
      category,
      flavors,
      sizes,
      isAvailable,
      featured,
      weatherSensitive,
      minimumStock,
      maximumStock,
      stock
    } = req.body;

    const cake = new Cake({
      user: req.user._id,
      name,
      description,
      image,
      price,
      category,
      flavors,
      sizes,
      isAvailable: isAvailable || true,
      featured: featured || false,
      weatherSensitive: weatherSensitive || false,
      minimumStock: minimumStock || 5,
      maximumStock: maximumStock || 50,
      stock: stock || 10
    });

    const createdCake = await cake.save();
    res.status(201).json(createdCake);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a cake
// @route   PUT /api/cakes/:id
// @access  Private/Admin
const updateCake = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      price,
      category,
      flavors,
      sizes,
      isAvailable,
      featured,
      weatherSensitive,
      minimumStock,
      maximumStock,
      stock
    } = req.body;

    const cake = await Cake.findById(req.params.id);

    if (cake) {
      cake.name = name || cake.name;
      cake.description = description || cake.description;
      cake.image = image || cake.image;
      cake.price = price || cake.price;
      cake.category = category || cake.category;
      cake.flavors = flavors || cake.flavors;
      cake.sizes = sizes || cake.sizes;
      cake.isAvailable = isAvailable !== undefined ? isAvailable : cake.isAvailable;
      cake.featured = featured !== undefined ? featured : cake.featured;
      cake.weatherSensitive = weatherSensitive !== undefined ? weatherSensitive : cake.weatherSensitive;
      cake.minimumStock = minimumStock !== undefined ? minimumStock : cake.minimumStock;
      cake.maximumStock = maximumStock !== undefined ? maximumStock : cake.maximumStock;
      cake.stock = stock !== undefined ? stock : cake.stock;

      const updatedCake = await cake.save();
      res.json(updatedCake);
    } else {
      res.status(404).json({ message: 'Cake not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a cake
// @route   DELETE /api/cakes/:id
// @access  Private/Admin
const deleteCake = async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);

    if (cake) {
      await cake.deleteOne();
      res.json({ message: 'Cake removed' });
    } else {
      res.status(404).json({ message: 'Cake not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/cakes/:id/reviews
// @access  Private
const createCakeReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const cake = await Cake.findById(req.params.id);

    if (cake) {
      const alreadyReviewed = cake.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400).json({ message: 'Cake already reviewed' });
        return;
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      cake.reviews.push(review);
      cake.numReviews = cake.reviews.length;
      cake.rating =
        cake.reviews.reduce((acc, item) => item.rating + acc, 0) /
        cake.reviews.length;

      await cake.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Cake not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  getCakes,
  getCakeById,
  createCake,
  updateCake,
  deleteCake,
  createCakeReview,
  getFeaturedCakes,
};