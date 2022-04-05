const sequelize = require('./sequelize');
const { Model, TEXT, DECIMAL, BOOLEAN, DATE } = require('sequelize');

class Job extends Model {}
Job.init(
  {
    description: {
      type: TEXT,
      allowNull: false,
    },
    price: {
      type: DECIMAL(12, 2),
      allowNull: false,
    },
    paid: {
      type: BOOLEAN,
      default: false,
    },
    paymentDate: {
      type: DATE,
    },
  },
  {
    sequelize,
    modelName: 'Job',
  }
);

module.exports = Job;
