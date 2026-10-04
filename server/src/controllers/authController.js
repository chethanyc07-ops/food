const AuthService = require('../services/authService');

class AuthController {
  static async register(req, res, next) {
    try {
      const { name, email, password, organization, role } = req.body;
      const result = await AuthService.register({ name, email, password, organization, role });
      res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });
      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req, res, next) {
    try {
      const user = await AuthService.getProfile(req.user._id);
      res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
