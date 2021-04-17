import authUser from "../../../apiUtils/authUser";
import { updateDormOccupancy, updateProfile } from "../../../apiUtils/database/user";

export default async (req, res) => {

  if (req.method !== "POST") {
    return res.status(404).send();
  }

  // Get discord_id from profile
  const profile = await authUser(req, res);

  // Update dorm_occupancy
  if (req.body.dorm_occupancy) {
    const update = await updateDormOccupancy(profile.discord_id, req.body.dorm_occupancy);

    if (!update) {
      return res.status(500).json({ error: true, details: "Unable to update dorm occupancy." })
    }

    return res.status(200).send(update);
  }

  // Update profile questions
  const update = await updateProfile(profile.discord_id, req.body);

  if (!update) {
    return res.status(500).json({ error: true, details: "Unable to update profile answers." })
  }

  return res.status(200).send(update);
}