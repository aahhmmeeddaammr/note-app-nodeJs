import { Router } from "express";
import * as userService from "./user.service.js";
import { verifyToken } from "../../utils/verifyToken.js";
const router = Router();
router.patch("/", verifyToken, userService.updateUser);
router.delete("/", verifyToken, userService.deleteUser);
router.get("/", verifyToken, userService.getByID);
export default router;
