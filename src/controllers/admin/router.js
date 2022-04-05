const { Router } = require('express');
const GetBestProfessionController = require('./GetBestProfessionController');
const GetBestClientsController = require('./GetBestClientsController');

module.exports = Router()
  .get('/best-profession', async (req, res, next) =>
    new GetBestProfessionController().requestHanlder(req, res, next)
  )
  .get('/best-clients', async (req, res, next) =>
    new GetBestClientsController().requestHanlder(req, res, next)
  );
