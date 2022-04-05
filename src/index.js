const ExpressServer = require('./server');
const routes = require('./routes');

module.exports = new ExpressServer().router(routes).listen();
