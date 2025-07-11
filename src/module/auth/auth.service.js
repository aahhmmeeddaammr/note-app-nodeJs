import { UserModel } from "../../db/models/User.Model.js";
import { generateToken } from "../../utils/generateToken.js";
import { hashPassword, verifyPassword } from "../../utils/hashPassword.js";
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, phone, age } = req.body;
    const checkUser = await UserModel.findOne({ email });
    if (checkUser) {
      return res.status(409).json({ message: "email already exist" });
    }
    const hashedPassword = await hashPassword(password);
    const encodedPhone = Buffer.from(phone, "utf-8").toString("base64");
    const user = await UserModel.create([{ name, email, password: hashedPassword, phone: encodedPhone, age }]);
    return res.status(201).json({ message: "Done", data: user });
  } catch (error) {
    return res.status(500).json({ message: "server error", error, info: error.message });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "in-valid email or password" });
    }
    const checkPassword = await verifyPassword(password, user.password);
    if (!checkPassword) {
      return res.status(404).json({ message: "in-valid email or password" });
    }
    return res.json({ message: "login successfully", token: generateToken(user) });
  } catch (error) {
    return res.status(500).json({ message: "server error", error, info: error.message });
  }
};
