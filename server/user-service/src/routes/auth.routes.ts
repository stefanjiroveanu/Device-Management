import express from "express";
import {
  loginUser,
  getRoleFromToken,
} from "../controller/AuthController";

const router = express.Router();

router.post("/login", loginUser);
router.get("/role", getRoleFromToken);

export default router;
