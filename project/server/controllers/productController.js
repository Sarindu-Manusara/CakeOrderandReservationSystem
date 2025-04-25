// import Cake from '../models/productModel.js';

// // @desc    Get all cakes
// // @route   GET /api/cakes
// // @access  Public
// const getCakes = async (req, res) => {
//   try {
//     const cakes = await Cake.find({});
//     res.json(cakes);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Get featured cakes
// // @route   GET /api/cakes/featured
// // @access  Public
// const getFeaturedCakes = async (req, res) => {
//   try {
//     const featuredCakes = await Cake.find({ featured: true });
//     res.json(featuredCakes);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Get single cake by ID
// // @route   GET /api/cakes/:id
// // @access  Public
// const getCakeById = async (req, res) => {
//   try {
//     const cake = await Cake.findById(req.params.id);
//     if (cake) {
//       res.json(cake);
//     } else {
//       res.status(404).json({ message: 'Cake not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Create a cake
// // @route   POST /api/cakes
// // @access  Private/Admin
// const createCake = async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       image,
//       price,
//       category,
//       flavors,
//       sizes,
//       isAvailable,
//       featured,
//       weatherSensitive,
//       minimumStock,
//       maximumStock,
//       stock
//     } = req.body;

//     const cake = new Cake({
//       user: req.user._id,
//       name,
//       description,
//       image,
//       price,
//       category,
//       flavors,
//       sizes,
//       isAvailable: isAvailable || true,
//       featured: featured || false,
//       weatherSensitive: weatherSensitive || false,
//       minimumStock: minimumStock || 5,
//       maximumStock: maximumStock || 50,
//       stock: stock || 10
//     });

//     const createdCake = await cake.save();
//     res.status(201).json(createdCake);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @desc    Update a cake
// // @route   PUT /api/cakes/:id
// // @access  Private/Admin
// const updateCake = async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       image,
//       price,
//       category,
//       flavors,
//       sizes,
//       isAvailable,
//       featured,
//       weatherSensitive,
//       minimumStock,
//       maximumStock,
//       stock
//     } = req.body;

//     const cake = await Cake.findById(req.params.id);

//     if (cake) {
//       cake.name = name || cake.name;
//       cake.description = description || cake.description;
//       cake.image = image || cake.image;
//       cake.price = price || cake.price;
//       cake.category = category || cake.category;
//       cake.flavors = flavors || cake.flavors;
//       cake.sizes = sizes || cake.sizes;
//       cake.isAvailable = isAvailable !== undefined ? isAvailable : cake.isAvailable;
//       cake.featured = featured !== undefined ? featured : cake.featured;
//       cake.weatherSensitive = weatherSensitive !== undefined ? weatherSensitive : cake.weatherSensitive;
//       cake.minimumStock = minimumStock !== undefined ? minimumStock : cake.minimumStock;
//       cake.maximumStock = maximumStock !== undefined ? maximumStock : cake.maximumStock;
//       cake.stock = stock !== undefined ? stock : cake.stock;

//       const updatedCake = await cake.save();
//       res.json(updatedCake);
//     } else {
//       res.status(404).json({ message: 'Cake not found' });
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @desc    Delete a cake
// // @route   DELETE /api/cakes/:id
// // @access  Private/Admin
// const deleteCake = async (req, res) => {
//   try {
//     const cake = await Cake.findById(req.params.id);

//     if (cake) {
//       await cake.deleteOne();
//       res.json({ message: 'Cake removed' });
//     } else {
//       res.status(404).json({ message: 'Cake not found' });
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // @desc    Create new review
// // @route   POST /api/cakes/:id/reviews
// // @access  Private
// const createCakeReview = async (req, res) => {
//   try {
//     const { rating, comment } = req.body;

//     const cake = await Cake.findById(req.params.id);

//     if (cake) {
//       const alreadyReviewed = cake.reviews.find(
//         (review) => review.user.toString() === req.user._id.toString()
//       );

//       if (alreadyReviewed) {
//         res.status(400).json({ message: 'Cake already reviewed' });
//         return;
//       }

//       const review = {
//         name: req.user.name,
//         rating: Number(rating),
//         comment,
//         user: req.user._id,
//       };

//       cake.reviews.push(review);
//       cake.numReviews = cake.reviews.length;
//       cake.rating =
//         cake.reviews.reduce((acc, item) => item.rating + acc, 0) /
//         cake.reviews.length;

//       await cake.save();
//       res.status(201).json({ message: 'Review added' });
//     } else {
//       res.status(404).json({ message: 'Cake not found' });
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export {
//   getCakes,
//   getCakeById,
//   createCake,
//   updateCake,
//   deleteCake,
//   createCakeReview,
//   getFeaturedCakes,
// };

// productController.js
import Product from '../models/productModel.js';

// @desc    Get all products (optionally filtered by type or featured)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { type, featured } = req.query;

    const filter = {};

    if (type && type !== 'all') {
      filter.productType = type;
    }

    if (featured) {
      filter.featured = featured === 'true';
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      price,
      category,
      productType,
      flavors,
      sizes,
      isAvailable,
      featured,
      weatherSensitive,
      minimumStock,
      maximumStock,
      stock
    } = req.body;

    const product = new Product({
      user: req.user._id,
      name,
      description,
      image,
      price,
      category,
      productType,
      flavors,
      sizes,
      isAvailable: isAvailable ?? true,
      featured: featured ?? false,
      weatherSensitive: weatherSensitive ?? false,
      minimumStock: minimumStock ?? 5,
      maximumStock: maximumStock ?? 50,
      stock: stock ?? 10
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      price,
      category,
      flavors,
      sizes,
      productType,
      isAvailable,
      featured,
      weatherSensitive,
      minimumStock,
      maximumStock,
      stock
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name ?? product.name;
      product.description = description ?? product.description;
      product.image = image ?? product.image;
      product.price = price ?? product.price;
      product.category = category ?? product.category;
      product.productType = productType ?? product.productType;
      product.flavors = flavors ?? product.flavors;
      product.sizes = sizes ?? product.sizes;
      product.isAvailable = isAvailable ?? product.isAvailable;
      product.featured = featured ?? product.featured;
      product.weatherSensitive = weatherSensitive ?? product.weatherSensitive;
      product.minimumStock = minimumStock ?? product.minimumStock;
      product.maximumStock = maximumStock ?? product.maximumStock;
      product.stock = stock ?? product.stock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create new review for a product
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400).json({ message: 'Product already reviewed' });
        return;
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get featured products (optionally filtered by product type)
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const { type } = req.query;

    const query = {
      featured: true,
      ...(type ? { productType: type } : {}),
    };

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getFeaturedProducts,
};
