import pool from "../db/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/UserRepository.js";

class AuthService {
  async register(username, password, role = 'user') {
    const existing = await UserRepository.findByUsername(username);
    if (existing) throw new Error('Username already exists');

    const hashed = await bcrypt.hash(password, 10);
    const user = await UserRepository.createUser(username, hashed, role);
    return { id: user.id, username: user.username, role: user.role };
  }

  async login(username, password) {
    const user = await UserRepository.findByUsername(username);
    if (!user) throw new Error('User not found');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid password');

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return { token, user: { id: user.id, username: user.username, role: user.role } };
  }
}

export default new AuthService();