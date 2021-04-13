import authUser from "../../../apiUtils/authUser";
import { updateProfile } from "../database/user";

export default async (req, res) => {

  if (req.method !== "POST") {
    return res.status(404).send();
  }

  // Update database with new profile answers
  const profile = await authUser(req, res);
  const update = await updateProfile(profile.discord_id, req.body);

  if (!update) {
    return res.status(500).json({ error: true, details: "Unable to update profile answers." })
  }

  return res.status(200).send(update);
}