const BaseController = require('../BaseController');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');

class DepositByUserIdController extends BaseController {
  async validateRequest(req, res) {
    if (!req.params.id) {
      throw new BaseController.BadRequestException(
        'Missing user ID on request'
      );
    }

    if (!req.body.depositAmount) {
      throw new BaseController.BadRequestException(
        'Missing depositAmount key on body'
      );
    }

    if (req.body.depositAmount < 0) {
      throw new BaseController.BadRequestException(
        'Amount to deposit cannot be lower than 0'
      );
    }
  }

  async executeRequest(req, res) {
    const models = req.app.get('models');
    const { body } = req;
    const { Profile, Job, Contract } = models;
    const { id } = req.params;

    const jobsBody = {
      where: {
        [Op.or]: [{ paid: null }, { paid: false }],
      },
      attributes: ['price'],
      include: [
        {
          model: Contract,
          where: {
            ClientId: id,
          },
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
    };

    const jobsToPay = await Job.findAll(jobsBody);
    const totalAmountToPay = jobsToPay.reduce(
      (prev, curr) => prev + curr.price,
      0
    );
    const limitToDeposit = totalAmountToPay * 0.25;

    if (body.depositAmount > limitToDeposit) {
      throw new BaseController.BadRequestException(
        `Amount to deposit is bigger than the deposit limit (${limitToDeposit})`
      );
    }

    await Profile.update(
      {
        balance: Sequelize.literal(`balance + ${body.depositAmount}`),
      },
      {
        where: {
          id,
        },
      }
    );

    res.json(
      await Profile.findOne({
        where: {
          id,
        },
      })
    );
  }
}

module.exports = DepositByUserIdController;
