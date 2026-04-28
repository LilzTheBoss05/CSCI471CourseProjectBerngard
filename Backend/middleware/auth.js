import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // bearer <token> 
  
  if (!token) return res.status(401).json({ message: 'not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user to request
    next();
  } catch (error) {
    res.status(401).json({ message: 'token invalid' });
  }
};
