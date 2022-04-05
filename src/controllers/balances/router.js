const { Router } = require('express');
const DepositByUserIdController = require('./DepositByUserIdController');

module.exports = Router().post('/deposit/:id', async (req, res, next) =>
  new DepositByUserIdController().requestHanlder(req, res, next)
);
