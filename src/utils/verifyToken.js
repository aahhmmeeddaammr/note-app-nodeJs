import jwt from "jsonwebtoken";
import { secretKey } from "./generateToken.js";
import { UserModel } from "../db/models/User.Model.js";

export async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;

    const checkUser = await UserModel.findById(decoded.userId);
    if (!checkUser) {
      return res.status(401).json({ message: "user is deleted" });
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token", error });
  }
}
