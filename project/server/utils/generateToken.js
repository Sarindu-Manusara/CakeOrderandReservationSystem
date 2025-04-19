import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // In a real application, you would use a proper secret from environment variables
  const secret = process.env.JWT_SECRET || 'your_jwt_secret';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

export default generateToken;