import { getUserById } from "../database/user";
import authUser from "../../../apiUtils/authUser";

export default async (req, res) => {
  const profile = await authUser(req, res);

  return res.status(200).json(profile);
}