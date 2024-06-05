const { User } = require('../models');

const findUserBySub = async (user_sub) => {
  return await User.findOne({ where: { user_sub } });
};

const createUser = async (user_sub) => {
  return await User.create({ user_sub });
};

module.exports = { findUserBySub, createUser };
