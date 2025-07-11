import express from "express";
import authController from "./module/auth/auth.controller.js";
import userController from "./module/user/user.controller.js";
import noteController from "./module/note/note.controller.js";
import { dbConnection } from "./db/connection.js";
export const bootstrap = async () => {
  const app = express();
  await dbConnection();
  app.use(express.json());

  app.get("/", (req, res, next) => {
    return res.json({ message: "Welcome in our mongodb app" });
  });

  app.use("/auth", authController);
  app.use("/note", noteController);
  app.use("/user", userController);

  app.all("{/*dummy}", (req, res, next) => {
    return res.status(404).json({ message: "In-valid method or url" });
  });

  app.listen(3000, () => {
    console.log("server running on port ::: 3000");
  });
};
