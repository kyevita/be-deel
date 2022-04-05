const { Router } = require('express');
const GetContractByIdController = require('./GetUnpaidJobsController');
const PayJobByIdController = require('./PayJobByIdController');

module.exports = Router()
  .get('/unpaid', async (req, res, next) =>
    new GetContractByIdController().requestHanlder(req, res, next)
  )
  .post('/:id/pay', async (req, res, next) =>
    new PayJobByIdController().requestHanlder(req, res, next)
  );
