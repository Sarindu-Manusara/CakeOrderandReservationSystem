import CartItem from '../models/cartModel.js';
import Product from '../models/productModel.js';
import CustomCake from '../models/customCakeModel.js';

// @desc    Get user's cart items
// @route   GET /api/cart
// @access  Private
const getCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.find({ user: req.user._id })
      .populate('product', 'name price image productType')
      .populate('customCake', 'flavor size price');
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const {
      productId,
      customCakeId,
      quantity,
      isCustom,
      customOptions,
      reservationDate,
      price
    } = req.body;

    let itemPrice;

if (!isCustom && productId) {
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  itemPrice = product.price;
} else if (isCustom && customCakeId) {
  const customCake = await CustomCake.findById(customCakeId);
  if (!customCake) {
    return res.status(404).json({ message: 'Custom cake not found' });
  }
  itemPrice = customCake.price;
} else {
  return res.status(400).json({ message: 'Invalid item information' });
}


    const cartItem = new CartItem({
      user: req.user._id,
      product: !isCustom ? productId : undefined,
      customCake: isCustom ? customCakeId : undefined,
      quantity,
      isCustom,
      customOptions,
      price: itemPrice,
      reservationDate
    });

    const createdCartItem = await cartItem.save();
    res.status(201).json(createdCartItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await CartItem.findById(req.params.id);

    if (cartItem && cartItem.user.toString() === req.user._id.toString()) {
      cartItem.quantity = quantity;
      const updatedCartItem = await cartItem.save();
      res.json(updatedCartItem);
    } else {
      res.status(404).json({ message: 'Cart item not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const cartItem = await CartItem.findById(req.params.id);

    if (cartItem && cartItem.user.toString() === req.user._id.toString()) {
      await cartItem.deleteOne();
      res.json({ message: 'Item removed from cart' });
    } else {
      res.status(404).json({ message: 'Cart item not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Clear user's cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    await CartItem.deleteMany({ user: req.user._id });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
