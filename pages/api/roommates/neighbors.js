import authUser from "../../../apiUtils/authUser";
import { getUserFloorsByRoomId } from "../../../apiUtils/database/user";

export default async (req, res) => {
  // Get user profile
  const profile = await authUser(req, res);

  if (!profile.room_id) {
    return res.status(200).json([])
  }

  const neighbors = await getUserFloorsByRoomId(profile.room_id);

  return res.status(200).json(neighbors);
}