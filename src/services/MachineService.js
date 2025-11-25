import { capitalizeFirstLetter } from "../helper/helper.js";

class MachineService {
  constructor(repo) {
    this.repo = repo;
  }

  async setStatus(id_machine, status) {
    try {
      const capitalizeStatus =
        capitalizeFirstLetter(status);

      const result = await this.repo.setStatus(
        id_machine,
        capitalizeStatus
      );

      return result;
    } catch (err) {
      throw err;
    }
  }

  async listAll() {
    try {
      return await this.repo.findAll();
    } catch (err) {
      throw err;
    }
  }

  async getById(id) {
    try {
      return await this.repo.findId(id);
    } catch (err) {
      throw err;
    }
  }

  async getByType(type) {
    try {
      return await this.repo.findType(type);
    } catch (err) {
      throw err;
    }
  }

  async getDataChart(hours) {
    try {
      return await this.repo.getDataChart(hours);
    } catch (err) {
      throw err;
    }
  }

  async create(data) {
    try {
      const result = await this.repo.create(data);
      return result;
    } catch (err) {
      return err;
    }
  }

  async update(data, id) {
    try {
      const result = await this.repo.update(
        data,
        id
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  async delete(id) {
    try {
      const result = await this.repo.delete(id);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

export default MachineService;
