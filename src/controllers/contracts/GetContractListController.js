const BaseController = require('../BaseController');
const { Op } = require('sequelize');

class GetContractListController extends BaseController {
  #getSearchField(profile) {
    return profile.type === 'client' ? 'ClientId' : 'ContractorId';
  }

  async executeRequest(req, res) {
    const { profile } = req;
    const { Contract } = req.app.get('models');
    const body = {
      where: {
        [this.#getSearchField(profile)]: profile.id,
        status: {
          [Op.not]: 'terminated',
        },
      },
    };
    const contractList = await Contract.findAll(body);

    res.json(contractList || []);
  }
}

module.exports = GetContractListController;
