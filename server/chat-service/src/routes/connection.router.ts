import { Router } from "express";
import { asignAdminToConnection, getConnection, getConnections } from "../controller/connection.controller";
import authChecker from "../middleware/auth.checker";

export const router = Router();

router.get("/", authChecker, getConnections);
router.get("/:userUuid", authChecker, getConnection);
router.post("/:userUuid/assign-admin", authChecker, asignAdminToConnection);