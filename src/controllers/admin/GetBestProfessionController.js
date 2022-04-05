const BaseController = require('../BaseController');
const Sequelize = require('sequelize');
const moment = require('moment');

class GetBestProfessionController extends BaseController {
  async validateRequest(req, res) {
    const { start, end } = req.query;
    if (!(start && end && moment(start).isValid() && moment(end).isValid())) {
      throw new BaseController.BadRequestException('Invalid date range');
    }
  }

  async executeRequest(req, res) {
    const { Contract, Job, Profile } = req.app.get('models');
    const { start, end } = req.query;

    const body = {
      where: {
        paid: true,
        paymentDate: {
          [Sequelize.Op.between]: [start, end],
        },
      },
      attributes: [
        [Sequelize.fn('sum', Sequelize.col('price')), 'total_paid'],
        [Sequelize.col('Contract.Contractor.profession'), 'profession_name'],
      ],
      group: ['profession_name'],
      include: [
        {
          model: Contract,
          include: [
            {
              model: Profile,
              as: 'Client',
            },
            {
              model: Profile,
              as: 'Contractor',
            },
          ],
          attributes: [],
          required: true,
        },
      ],
      order: [[Sequelize.literal('total_paid'), 'DESC']],
      limit: 1,
    };

    res.json(await Job.findAll(body));
  }
}

module.exports = GetBestProfessionController;
