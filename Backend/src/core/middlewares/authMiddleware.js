const { verifyToken } = require('../utils/cognitoUtils');
const { findUserBySub, createUser } = require('../../data/repositories/userRepository');
const { limitFailsByToken, limitFailsByTokenAndIP, limitSlowerIP } = require("./rateMiddleware")

const finduser = async(token) => {
  try {
    const decodedToken = await verifyToken(token);
    return await findUserBySub(decodedToken.sub);
  } catch(error) {
    return undefined;
  }
}

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    if (!token) {
      console.log('No token provided');
      await limitSlowerIP.consume(req.ip);
      return res.status(401).json({ message: 'Unauthorized' });
    }
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
    if (res.locals.tokenIpConsumedPoints > 0) {
      await limitFailsByTokenAndIP.delete(`${token}_${ip}`)
    }
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Authentication error:', error);
      await Promise.all([
        limitFailsByToken.consume(token),
        limitFailsByTokenAndIP.consume(`${token}_${ip}`)
      ])
      res.status(401).json({ message: 'Unauthorized', error: error.message });
    } else {
      res.status(429).json({ message: "Too many requests"});
    }
  }
};

module.exports = { authenticate, finduser };
