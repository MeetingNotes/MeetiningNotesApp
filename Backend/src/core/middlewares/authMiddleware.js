const { verifyToken } = require('../utils/cognitoUtils');
const { findUserBySub, createUser } = require('../../data/repositories/userRepository');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    console.log('Token received:', token);
    const decodedToken = await verifyToken(token);
    console.log('Decoded token:', decodedToken);

    let user = await findUserBySub(decodedToken.sub);
    if (!user) {
      console.log('User not found, creating new user with sub:', decodedToken.sub);
      user = await createUser(decodedToken.sub);
    }

    console.log('User authenticated:', user);
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};

module.exports = { authenticate };
