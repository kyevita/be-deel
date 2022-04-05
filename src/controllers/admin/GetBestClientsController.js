const BaseController = require('../BaseController');
const Sequelize = require('sequelize');
const moment = require('moment');

class GetBestClientsController extends BaseController {
  async validateRequest(req, res) {
    const { start, end } = req.query;
    if (!(start && end && moment(start).isValid() && moment(end).isValid())) {
      throw new BaseController.BadRequestException('Invalid date range');
    }
  }

  async executeRequest(req, res) {
    const { Contract, Job, Profile } = req.app.get('models');
    const { start, end, limit = 2 } = req.query;

    const body = {
      where: {
        paid: true,
        paymentDate: {
          [Sequelize.Op.between]: [start, end],
        },
      },
      attributes: [
        [Sequelize.col('Contract.Client.id'), 'id'],
        [Sequelize.col('Contract.Client.firstName'), 'firstName'],
        [Sequelize.col('Contract.Client.lastName'), 'lastName'],
        [Sequelize.col('Contract.Client.profession'), 'profession'],
        [Sequelize.fn('sum', Sequelize.col('price')), 'total_paid'],
      ],
      group: ['Contract.Client.id'],
      include: [
        {
          model: Contract,
          include: [
            {
              model: Profile,
              as: 'Client',
            },
          ],
          attributes: [],
          required: true,
        },
      ],
      limit,
      order: [[Sequelize.literal('total_paid'), 'DESC']],
    };

    res.json(await Job.findAll(body));
  }
}

module.exports = GetBestClientsController;
