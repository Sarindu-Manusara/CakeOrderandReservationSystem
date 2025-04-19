import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'your_jwt_secret';

  // Sign the token with the user ID payload
  return jwt.sign({ id: userId }, secret, {
    expiresIn: '30d', // Token valid for 30 days
  });
};

export default generateToken;
