class MaintenanceService {
  constructor(repo) {
    this.repo = repo;
  }

  async allMaintenance() {
    try {
      const result = await this.repo.getAll();

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getById(id_maintenance) {
    try {
      const result = await this.repo.getById(
        id_maintenance
      );

      return result;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  async getByMachineId(id_machine) {
    try {
      const result =
        await this.repo.getByMachineId(
          id_machine
        );

      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateMaintenance(
    id_maintenance,
    status,
    message
  ) {
    try {
      const result =
        await this.repo.updateMaintenance(
          id_maintenance,
          status,
          message
        );

      return result;
    } catch (err) {
      throw err;
    }
  }

  async deleteMaintenance(id_maintenance) {
    try {
      const result =
        await this.repo.deleteMaintenance(
          id_maintenance
        );

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getMessage() {
    try {
      const result = await this.repo.getMessage();

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getMessageById(id) {
    try {
      const result =
        await this.repo.getMessageById(id);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async deleteMessage(id) {
    try {
      await this.repo.deleteMessage(id);
    } catch (err) {
      throw err;
    }
  }
}

export default MaintenanceService;
