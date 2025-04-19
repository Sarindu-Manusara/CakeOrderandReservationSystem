import jwt from 'jsonwebtoken';

// Middleware to protect routes - verifies the JWT token
const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // In a real application, you would use a proper secret from environment variables
      const secret = process.env.JWT_SECRET || 'your_jwt_secret';
      
      const decoded = jwt.verify(token, secret);

      // For demo/development purposes
      // In production, you would fetch the user from the database
      req.user = {
        _id: decoded.id,
        name: decoded.id === '1' ? 'Admin User' : 'John Doe',
        email: decoded.id === '1' ? 'admin@example.com' : 'john@example.com',
        isAdmin: decoded.id === '1',
      };

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

// Middleware to check if user is an admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };