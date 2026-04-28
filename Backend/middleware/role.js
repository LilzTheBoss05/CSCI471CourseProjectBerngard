export const requireRole = (role) => {
  return (req, res, next) => {
    // role is always validated from db, dont trust jwt payload alone 
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: 'forbidden: requires admin access' });
    }
  };
};
