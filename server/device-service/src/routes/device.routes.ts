import Router from "express";
import {
  deleteDeviceByUuuid,
  findAllDevices,
  findDeviceByUuid,
  removeDeviceRelations,
  saveDevice,
  updateDeviceByUuid,
} from "../controller/DeviceController";
import authChecker from "../middleware/auth.checker";

const router = Router();

router.get("/", authChecker, findAllDevices);
router.get("/:uuid", authChecker, findDeviceByUuid);
router.post("/", authChecker, saveDevice);
router.delete("/:uuid", authChecker, deleteDeviceByUuuid);
router.put("/:uuid", authChecker, updateDeviceByUuid);
router.delete("/relations/:user", authChecker, removeDeviceRelations);

export default router;
