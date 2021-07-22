import authUser from "../../../apiUtils/authUser";
import { updateRoom } from "../../../apiUtils/database/user";

export default async (req, res) => {

  if (req.method !== "POST") {
    return res.status(404).send();
  }

  // Get discord_id from profile
  const profile = await authUser(req, res);

  // Update profile questions
  const update = await updateRoom(profile.discord_id, req.body.room_id);

  if (!update) {
    return res.status(500).json({ error: true, details: "Unable to update room." })
  }

  return res.status(200).send(update);
}