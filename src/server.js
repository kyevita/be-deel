const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/errorHandler');
const { sequelize } = require('./models');
const app = express();

class ExpressServer {
  constructor() {
    app.use(bodyParser.json());
    app.set('sequelize', sequelize);
    app.set('models', sequelize.models);
  }

  router(routes) {
    routes(app);
    return this;
  }

  listen(port = 3001) {
    try {
      app.use(errorHandler);
      app.listen(port, () => {
        console.log('Express App Listening on Port ' + port);
      });

      return app;
    } catch (error) {
      console.error(`An error occurred: ${JSON.stringify(error)}`);
      process.exit(1);
    }
  }
}

module.exports = ExpressServer;
