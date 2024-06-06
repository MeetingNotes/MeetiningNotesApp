const { verifyToken } = require('../utils/cognitoUtils');
const { findUserBySub, createUser } = require('../../data/repositories/userRepository');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = await verifyToken(token);

    let user = await findUserBySub(decodedToken.sub);
    if (!user) {
      user = await createUser(decodedToken.sub);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};

module.exports = { authenticate };
