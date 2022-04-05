const getProfile = require('./middleware/getProfile');
const contractsRoute = require('./controllers/contracts/router');
const jobsRoute = require('./controllers/jobs/router');
const balancesRoute = require('./controllers/balances/router');
const adminRoute = require('./controllers/admin/router');

module.exports = function (app) {
  app.use('/contracts', getProfile, contractsRoute);
  app.use('/balances', getProfile, balancesRoute);
  app.use('/jobs', getProfile, jobsRoute);
  app.use('/admin', getProfile, adminRoute);
};
