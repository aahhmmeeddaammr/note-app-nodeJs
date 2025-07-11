import { UserModel } from "../../db/models/User.Model.js";

export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { email, name, age } = req.body;

    const updateData = {};
    if (email !== undefined) updateData.email = email;
    if (name !== undefined) updateData.name = name;
    if (age !== undefined) updateData.age = age;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    if (email) {
      const checkUser = await UserModel.findOne({ email });
      if (checkUser) {
        return res.status(409).json({ message: "email already exist" });
      }
    }

    const user = await UserModel.findByIdAndUpdate(userId, { ...updateData, $inc: { __v: 1 } }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User updated successfully", data: user });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
      info: error.message,
    });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "in-valid account id" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
      info: error.message,
    });
  }
};

export const getByID = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await UserModel.findById(userId);
    return res.json({ message: "Done", data: user });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
      info: error.message,
    });
  }
};
