import AuthError from "../error/AuthError.js";
import ClientError from "../error/ClientError.js";
import ValidationError from "../error/ValidationError.js";
import MachineService from "../services/MachineService.js";
import DatabaseError from "../error/DatabaseError.js";
import MachineRepository from "../repositories/MachineRepository.js";
import { validationResult } from "express-validator";

class MachineController {
  constructor() {
    this.service = new MachineService(
      new MachineRepository()
    );

    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.getByType = this.getByType.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.setStatus = this.setStatus.bind(this);
    this.getDataChart =
      this.getDataChart.bind(this);
  }

  async getAll(req, res) {
    try {
      const result = await this.service.listAll();
      return res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(500).json({
          status: "fail",
          message: err.message,
        });
      }
    }
  }

  async getById(req, res) {
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

  async getByType(req, res) {
    try {
      const result = await this.service.getByType(
        req.params.type
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

  async getDataChart(req, res) {
    try {
      const { hours } = req.query;
      const hoursLimit = [1, 2, 3];
      const nowDate = new Date();
      const earlierDate = new Date(
        nowDate.getTime() -
          Number(hours) * 60 * 60 * 1000
      );

      if (hours === undefined) {
        throw new ClientError(
          "Membutuhkan query string hours!"
        );
      }

      if (!hoursLimit.includes(Number(hours))) {
        throw new ClientError(
          "Hours limit tidak valid"
        );
      }

      const recap =
        await this.service.getDataChart(hours);

      return res.status(200).json({
        status: "success",
        data: {
          sensor: recap,
          date: {
            start: nowDate.toLocaleString(
              "id-ID",
              { timeZone: "Asia/Jakarta" }
            ),
            before: earlierDate.toLocaleString(
              "id-ID",
              { timeZone: "Asia/Jakarta" }
            ),
          },
        },
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
          message: err.message,
        });
      }
    }
  }

  async create(req, res) {
    try {
      // validation request checking
      const error = validationResult(req);
      if (!error.isEmpty()) {
        throw new ValidationError(error.array());
      }

      const payload = {
        type: req.body.type,
        name: req.body.name,
      };

      const result = await this.service.create(
        payload
      );

      return res.status(201).json({
        status: "success",
        message: `Berhasil menambahkan machine dengan performa ${result}`,
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

  async update(req, res) {
    try {
      // checking validation request
      const error = validationResult(req);
      if (!error.isEmpty()) {
        throw new ValidationError(error.array());
      }

      const payload = {
        type: req.body.type,
        name: req.body.name,
      };

      // update data machine
      const result = await this.service.update(
        payload,
        req.params.id
      );

      return res.status(203).json({
        status: "success",
        message: `Berhasil mengupdate data machine ${result}`,
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

  async setStatus(req, res) {
    try {
      // get params machine
      const idMachine = req.params.machine;
      const { status } = req.query;

      // update data machine
      const result = await this.service.setStatus(
        idMachine,
        status
      );

      return res.status(203).json({
        status: "success",
        message: result,
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

  async remove(req, res) {
    try {
      const result = await this.service.delete(
        req.params.id
      );

      return res.status(200).json({
        status: "success",
        message: `Berhasil menghapus machine dengan performa ${result}`,
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

export default MachineController;
