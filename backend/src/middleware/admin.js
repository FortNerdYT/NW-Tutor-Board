const adminMiddleware = (req, res, next) => {
  const adminPassword = req.headers['x-admin-password'];
  const expectedPassword = process.env.ADMIN_PASSWORD;

  console.log('Admin password check:', {
    hasPassword: !!adminPassword,
    hasExpected: !!expectedPassword,
    configured: !!process.env.ADMIN_PASSWORD
  });

  if (!expectedPassword) {
    return res.status(500).json({ error: 'Admin password not configured' });
  }

  if (!adminPassword || adminPassword !== expectedPassword) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

module.exports = adminMiddleware;
