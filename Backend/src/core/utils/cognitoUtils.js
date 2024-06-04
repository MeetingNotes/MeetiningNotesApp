const { CognitoJwtVerifier } = require('aws-jwt-verify');

// Create the verifier
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  clientId: process.env.COGNITO_CLIENT_ID,
});

const verifyToken = async (token) => {
  console.log('Verifying token:', token);
  try {
    const payload = await verifier.verify(token);
    console.log('Token verification successful:', payload);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Token verification failed');
  }
};

module.exports = { verifyToken };
