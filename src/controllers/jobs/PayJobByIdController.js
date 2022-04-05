const BaseController = require('../BaseController');
const Sequelize = require('sequelize');

class PayJobByIdController extends BaseController {
  #getSearchField(profile) {
    return profile.type === 'client' ? 'ClientId' : 'ContractorId';
  }

  async #getJobById(id, profile, models) {
    const { Job, Profile, Contract } = models;

    return Job.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Contract,
          where: {
            [this.#getSearchField(profile)]: profile.id,
          },
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
          required: true,
        },
      ],
    });
  }

  async validateRequest(req, res) {
    if (!req.params.id) {
      throw new BaseController.BadRequestException('Missing job ID on request');
    }
  }

  async executeRequest(req, res) {
    const models = req.app.get('models');
    const { profile } = req;
    const { Job, Profile, Contract } = models;
    const { id } = req.params;

    const body = {
      where: {
        id,
      },
      attributes: [
        'price',
        [Sequelize.col('Contract.Client.id'), 'clientId'],
        [Sequelize.col('Contract.Contractor.id'), 'contractorId'],
        [Sequelize.col('Contract.Client.balance'), 'clientBalance'],
      ],
      include: [
        {
          model: Contract,
          where: {
            [this.#getSearchField(profile)]: profile.id,
          },
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
    };

    const jobToPay = await Job.findOne(body);

    if (!jobToPay) {
      throw new BaseController.NotFoundException();
    }

    const { price, clientId, clientBalance, contractorId } = jobToPay.toJSON();

    if (price > clientBalance) {
      throw new BaseController.BadRequestException(
        'Client has insufficient funds to pay target job'
      );
    }

    console.log({ price, clientId, clientBalance, contractorId });

    const promises = [
      Job.update(
        {
          paid: true,
          paymentDate: new Date(),
        },
        {
          where: {
            id,
          },
        }
      ),
      Profile.update(
        {
          balance: clientBalance - price,
        },
        {
          where: {
            id: clientId,
          },
        }
      ),
      Profile.update(
        {
          balance: Sequelize.literal(`balance + ${price}`),
        },
        {
          where: {
            id: contractorId,
          },
        }
      ),
    ];

    await Promise.all(promises);

    res.json(await this.#getJobById(id, profile, models));
  }
}

module.exports = PayJobByIdController;
