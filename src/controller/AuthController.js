import AuthService from "../services/AuthService.js";

class AuthController {
  async register(req, res) {
    try {
      const { username, password, role } = req.body;
      const result = await AuthService.register(username, password, role);
      res.status(201).json({ message: "User registered", data: result });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await AuthService.login(username, password);
      res.json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }
}

export default new AuthController();
