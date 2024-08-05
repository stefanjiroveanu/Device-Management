import express from "express";
import {
  insertUser,
  findAllUsers,
  findUser,
  deleteUser,
  updateUser,
} from "../controller/UserController";
import authChecker, { isAdmin } from "../middleware/auth.checker";

const router = express.Router();

router.post("/", insertUser); 
router.get("/", authChecker, isAdmin, findAllUsers);
router.get("/:uuid", authChecker, findUser);
router.delete("/:uuid", authChecker, isAdmin, deleteUser);
router.put("/:uuid", authChecker, isAdmin, updateUser);
export default router;
