import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.user || !decoded.user.id) {
      return res.status(401).json({ message: 'Invalid token: Missing user data' });
    }
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token Verification Error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};