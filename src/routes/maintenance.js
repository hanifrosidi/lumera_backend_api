import express from "express";
import MaintenanceController from "../controller/MaintenanceController.js";
import { body } from "express-validator";

const maintenanceRouter = express.Router();
const controller = new MaintenanceController();

maintenanceRouter.get(
  "/",
  controller.getAllMaintenance
);

maintenanceRouter.get(
  "/:id",
  controller.getMaintenanceById
);

maintenanceRouter.get(
  "/machine/:id",
  controller.getMaintenanceByMachine
);

maintenanceRouter.put(
  "/:id",
  [
    body("message")
      .notEmpty()
      .withMessage(
        "message maintenance harus diisi"
      ),
  ],
  controller.updateMaintenance
);

maintenanceRouter.delete(
  "/:id",
  controller.deleteMaintenance
);

// maintenance message
maintenanceRouter.get(
  "/message/all",
  controller.getMaintenanceMessage
);

maintenanceRouter.get(
  "/message/:id",
  controller.getMaintenanceMessageById
);

maintenanceRouter.delete(
  "/message/:id",
  controller.deleteMaintenanceMessage
);

export default maintenanceRouter;
