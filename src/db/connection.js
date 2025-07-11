import mongoose from "mongoose";

export const dbConnection = async () => {
  const result = await mongoose.connect("mongodb://localhost:27017/noteapp");
  console.log({ result });
};
