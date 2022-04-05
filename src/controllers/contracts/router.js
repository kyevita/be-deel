const { Router } = require('express');
const GetContractByIdController = require('./GetContractByIdController');
const GetContractListController = require('./GetContractListController');

module.exports = Router()
  .get('/', async (req, res, next) =>
    new GetContractListController().requestHanlder(req, res, next)
  )
  .get('/:id', async (req, res, next) =>
    new GetContractByIdController().requestHanlder(req, res, next)
  );
