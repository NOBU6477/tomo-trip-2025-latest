function requireRole(role) {
  return (req, res, next) => {
    const userRole = (req.user && req.user.role) || 
                     String(req.headers['x-demo-role'] || '').toLowerCase();
    
    if (userRole === role || userRole === 'admin') {
      return next();
    }
    
    return res.status(403).json({ 
      error: 'forbidden',
      message: `このリソースにアクセスするには${role}権限が必要です` 
    });
  };
}

module.exports = { requireRole };
