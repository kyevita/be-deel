const BaseController = require('../BaseController');
const { Op } = require('sequelize');

class GetUnpaidJobsController extends BaseController {
  #getSearchField(profile) {
    return profile.type === 'client' ? 'ClientId' : 'ContractorId';
  }

  async executeRequest(req, res) {
    const { profile } = req;
    const { Contract, Job } = req.app.get('models');
    const body = {
      where: {
        [Op.or]: [{ paid: null }, { paid: false }],
      },
      include: [
        {
          model: Contract,
          where: {
            [this.#getSearchField(profile)]: profile.id,
            status: {
              [Op.not]: 'terminated',
            },
          },
          attributes: [],
          required: true,
        },
      ],
    };
    const jobList = await Job.findAll(body);

    res.json(jobList || []);
  }
}

module.exports = GetUnpaidJobsController;
