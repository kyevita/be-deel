const sequelize = require('./sequelize');
const { Model, TEXT, ENUM } = require('sequelize');

class Contract extends Model {}
Contract.init(
  {
    terms: {
      type: TEXT,
      allowNull: false,
    },
    status: {
      type: ENUM('new', 'in_progress', 'terminated'),
    },
  },
  {
    sequelize,
    modelName: 'Contract',
  }
);

module.exports = Contract;
