const adminMiddleware = (req, res, next) => {
  const adminPassword = req.headers['x-admin-password'];
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || adminPassword !== expectedPassword) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

module.exports = adminMiddleware;
