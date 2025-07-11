import jwt from "jsonwebtoken";
export const secretKey =
  "a55c89abec79adb9c57fb3a0e7c2b019a9860723363bf04e84ae2a049c0623dea0d02ce89d7780a87880ebcb60e633091d7f7343c3db74e58f214c7f7aa3accb";
export const generateToken = (user) => {
  const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: "1h" });
  return token;
};
