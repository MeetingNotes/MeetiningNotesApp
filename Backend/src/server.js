const app = require('./core/app');
const { sequelize } = require('./data/models');

const port = process.env.PORT || 3500;

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
