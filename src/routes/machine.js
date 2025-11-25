import express from "express";
import MachineController from "../controller/MachineController.js";
import { body } from "express-validator";

const machinesRouter = express.Router();
const controller = new MachineController();

machinesRouter.get("/", controller.getAll);
machinesRouter.get("/:id", controller.getById);
machinesRouter.get(
  "/type/:type",
  controller.getByType
);

machinesRouter.get(
  "/sensor/chart",
  controller.getDataChart
);

machinesRouter.post(
  "/",
  [
    body("type")
      .notEmpty()
      .withMessage("Attribut type is not empty")
      .isIn(["H", "L", "M"])
      .withMessage("Type not in enum"),
    body("name")
      .notEmpty()
      .withMessage("Attribut name is not empty")
      .isIn([
        "High performance",
        "Medium performance",
        "Low performance",
      ])
      .withMessage("Type name not in enum"),
  ],
  controller.create
);
machinesRouter.put(
  "/:id",
  [
    body("type")
      .notEmpty()
      .withMessage("Attribut type is not empty")
      .isIn(["H", "L", "M"])
      .withMessage("Type not in enum"),
    body("name")
      .notEmpty()
      .withMessage("Attribut name is not empty")
      .isIn([
        "High performance",
        "Medium performance",
        "Low performance",
      ])
      .withMessage("Type name not in enum"),
  ],
  controller.update
);

machinesRouter.put(
  "/change/:machine",
  controller.setStatus
);
machinesRouter.delete("/:id", controller.remove);

export default machinesRouter;
