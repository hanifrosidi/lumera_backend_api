import { DatabaseError } from "pg";
import AuthError from "../error/AuthError.js";
import ClientError from "../error/ClientError.js";
import ValidationError from "../error/ValidationError.js";
import MaintenanceRepository from "../repositories/MaintenanceRepository.js";
import MaintenanceService from "../services/MaintenanceService.js";
import { validationResult } from "express-validator";

class MaintenanceController {
  constructor() {
    this.service = new MaintenanceService(
      new MaintenanceRepository()
    );

    this.getAllMaintenance =
      this.getAllMaintenance.bind(this);
    this.getMaintenanceById =
      this.getMaintenanceById.bind(this);
    this.getMaintenanceByMachine =
      this.getMaintenanceByMachine.bind(this);
    this.updateMaintenance =
      this.updateMaintenance.bind(this);
    this.deleteMaintenance =
      this.deleteMaintenance.bind(this);
    this.getMaintenanceMessage =
      this.getMaintenanceMessage.bind(this);
    this.getMaintenanceMessageById =
      this.getMaintenanceMessageById.bind(this);
    this.deleteMaintenanceMessage =
      this.deleteMaintenanceMessage.bind(this);
  }

  async getAllMaintenance(req, res) {
    try {
      const result =
        await this.service.allMaintenance();

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof ClientError) {
        return res.status(404).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof AuthError) {
        return res.status(401).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof DatabaseError) {
        return res.status(503).json({
          status: "fail",
          message: err.message,
        });
      } else {
        return res.status(500).json({
          status: "fail",
          message: "Server error",
        });
      }
    }
  }

  async getMaintenanceById(req, res) {
    try {
      const result = await this.service.getById(
        req.params.id
      );

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof ClientError) {
        return res.status(404).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof AuthError) {
        return res.status(401).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof DatabaseError) {
        return res.status(503).json({
          status: "fail",
          message: err.message,
        });
      } else {
        return res.status(500).json({
          status: "fail",
          message: "Server error",
        });
      }
    }
  }

  async getMaintenanceByMachine(req, res) {
    try {
      const result =
        await this.service.getByMachineId(
          req.params.id
        );

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof ClientError) {
        return res.status(404).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof AuthError) {
        return res.status(401).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof DatabaseError) {
        return res.status(503).json({
          status: "fail",
          message: err.message,
        });
      } else {
        return res.status(500).json({
          status: "fail",
          message: "Server error",
        });
      }
    }
  }

  async updateMaintenance(req, res) {
    try {
      const error = validationResult(req);

      if (!error.isEmpty()) {
        throw ValidationError(error.array());
      }

      const { status } = req.query;

      const result =
        await this.service.updateMaintenance(
          req.params.id,
          status,
          req.body.message
        );

      return res.status(203).json({
        status: "success",
        message: `Berhasil update status maintenance machine ${result}`,
      });
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof ClientError) {
        return res.status(404).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof AuthError) {
        return res.status(401).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof DatabaseError) {
        return res.status(503).json({
          status: "fail",
          message: err.message,
        });
      } else {
        return res.status(500).json({
          status: "fail",
          message: "Server error",
        });
      }
    }
  }

  async deleteMaintenance(req, res) {
    try {
      const result =
        await this.service.deleteMaintenance(
          req.params.id
        );

      return res.status(200).json({
        status: "success",
        message: `Berhasil menghapus machine ${result} dari daftar maintenance`,
      });
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof ClientError) {
        return res.status(404).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof AuthError) {
        return res.status(401).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof DatabaseError) {
        return res.status(503).json({
          status: "fail",
          message: err.message,
        });
      } else {
        return res.status(500).json({
          status: "fail",
          message: "Server error",
        });
      }
    }
  }

  async getMaintenanceMessage(req, res) {
    try {
      // console.log("controller call");

      const result =
        await this.service.getMessage();

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof ClientError) {
        return res.status(404).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof AuthError) {
        return res.status(401).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof DatabaseError) {
        return res.status(503).json({
          status: "fail",
          message: err.message,
        });
      } else {
        return res.status(500).json({
          status: "fail",
          message: "Server error",
        });
      }
    }
  }

  async getMaintenanceMessageById(req, res) {
    try {
      const result =
        await this.service.getMessageById(
          req.params.id
        );

      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof ClientError) {
        return res.status(404).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof AuthError) {
        return res.status(401).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof DatabaseError) {
        return res.status(503).json({
          status: "fail",
          message: err.message,
        });
      } else {
        return res.status(500).json({
          status: "fail",
          message: "Server error",
        });
      }
    }
  }

  async deleteMaintenanceMessage(req, res) {
    try {
      await this.service.deleteMessage(
        req.params.id
      );

      return res.status(200).json({
        status: "success",
        message: `Berhasil menghapus message maintenance`,
      });
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof ClientError) {
        return res.status(404).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof AuthError) {
        return res.status(401).json({
          status: "fail",
          message: err.message,
        });
      } else if (err instanceof DatabaseError) {
        return res.status(503).json({
          status: "fail",
          message: err.message,
        });
      } else {
        return res.status(500).json({
          status: "fail",
          message: "Server error",
        });
      }
    }
  }
}

export default MaintenanceController;
