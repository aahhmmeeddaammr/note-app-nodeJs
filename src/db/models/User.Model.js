import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
  },
  age: {
    type: Number,
    min: 18,
    max: 60,
  },
});
export const UserModel = mongoose.models.user || mongoose.model("user", Schema);
