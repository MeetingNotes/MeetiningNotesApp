require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const moment = require('moment');

// Overriding default date/time behaviour
Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
    date = this._applyTimezone(date, options);
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
};

const sequelize = new Sequelize(process.env.DATABASE_URL, { dialect: 'mssql' });

const User = require('./User')(sequelize, DataTypes);
const DocumentType = require('./DocumentType')(sequelize, DataTypes);
const UploadedDocument = require('./UploadedDocument')(sequelize, DataTypes);
const GeneratedDocument = require('./GeneratedDocument')(sequelize, DataTypes);

const setupAssociations = () => {
    const models = { User, DocumentType, UploadedDocument, GeneratedDocument };
    Object.keys(models).forEach(key => {
      if ('associate' in models[key]) {
        models[key].associate(models);
      }
    });
};

setupAssociations();

module.exports = { sequelize, User, DocumentType, UploadedDocument, GeneratedDocument };
