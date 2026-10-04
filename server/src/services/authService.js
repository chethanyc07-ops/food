const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');

class AuthService {
  static generateToken(user) {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      config.JWT_SECRET,
      {
        expiresIn: config.JWT_EXPIRES_IN,
      }
    );
  }

  static async register({ name, email, password, organization, role }) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const error = new Error('A user with this email already exists');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      organization: organization || 'MoFPI Packaging Lab',
      role: role || 'operator',
      lastLogin: new Date(),
    });

    const token = this.generateToken(user);
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
      },
      token,
    };
  }

  static async login({ email, password }) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    user.lastLogin = new Date();
    await user.save();

    const token = this.generateToken(user);
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
      },
      token,
    };
  }

  static async getProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
}

module.exports = AuthService;
