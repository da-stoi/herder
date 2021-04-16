import authUser from "../../../apiUtils/authUser";

export default async (req, res) => {
  // Get user profile
  const profile = await authUser(req, res);

  return res.status(200).json(profile);
}