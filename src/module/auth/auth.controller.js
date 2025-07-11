import { Router } from "express";
import * as authService from "./auth.service.js";
import { UserModel } from "../../db/models/User.Model.js";
const router = Router();

router.post("/signup", authService.signup);
router.post("/login", authService.login);

export default router;
