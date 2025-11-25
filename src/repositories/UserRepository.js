import db from '../db/connection.js';

class UserRepository {
  async findByUsername(username) {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  }

  async createUser(username, hashedPassword, role = 'user') {
    const result = await db.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, role]
    );
    return result.rows[0];
  }
}

export default new UserRepository();
