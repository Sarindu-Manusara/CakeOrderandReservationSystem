import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; // adjust the path if needed
import asyncHandler from 'express-async-handler';


// Middleware to protect routes - verifies the JWT token and attaches user info to req
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  console.log('⚠️ Protect middleware hit');
  console.log('Authorization Header:', req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('❌ Token verification failed:', error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});


// Middleware to check if user is an admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

export { admin };
