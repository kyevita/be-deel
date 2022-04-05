const BaseController = require('../BaseController');

class GetContractByIdController extends BaseController {
  #getSearchField(profile) {
    return profile.type === 'client' ? 'ClientId' : 'ContractorId';
  }

  async validateRequest(req, res) {
    if (!req.params.id) {
      throw new BaseController.BadRequestException(
        'Missing contract ID on request'
      );
    }
  }

  async executeRequest(req, res) {
    const { profile } = req;
    const { Contract } = req.app.get('models');
    const { id } = req.params;
    const body = {
      where: {
        id,
        [this.#getSearchField(profile)]: profile.id,
      },
    };
    const contract = await Contract.findOne(body);

    if (!contract) {
      throw new BaseController.NotFoundException('Contract Not Found');
    }

    res.json(contract);
  }
}

module.exports = GetContractByIdController;
