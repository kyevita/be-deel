class ControllerException extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class BadRequestException extends ControllerException {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

class NotFoundException extends ControllerException {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

class ForbbidenException extends ControllerException {
  constructor(message = 'Forbbiden') {
    super(message, 403);
  }
}

class UnauthorizedException extends ControllerException {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class ServerException extends ControllerException {
  constructor(message = 'Server Error') {
    super(message, 500);
  }
}

class BaseController {
  static ControllerException = ControllerException;
  static BadRequestException = BadRequestException;
  static NotFoundException = NotFoundException;
  static ForbbidenException = ForbbidenException;
  static UnauthorizedException = UnauthorizedException;
  static ServerException = ServerException;

  // This is an abstract class, you should extend this class in your new controllers.
  // Since this is an abstract controller, any attemt of initialize this class without extending it will throw an exception.
  constructor() {
    if (this.constructor === BaseController) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  // This is an abstract method, you should override it in the new controllers you create.
  /**
   * @param req {Request}
   * @param res {Response}
   * @return {Promise<void | {}}>
   */
  async executeRequest(req, res) {
    throw new Error('Method executeRequest is not implemented!');
  }

  // This is an overridable method, you can override it in the new controllers you create.
  /**
   * @param req {Request}
   * @param res {Response}
   * @return {Promise<boolean>}
   */
  async validateRequest(req, res) {}

  async requestHanlder(req, res, next) {
    try {
      await this.validateRequest(req, res);
      await this.executeRequest(req, res);
    } catch (err) {
      if (!err.status) {
        err.status = err.statusCode || 500;
      }

      next(err);
    }
  }
}

module.exports = BaseController;
