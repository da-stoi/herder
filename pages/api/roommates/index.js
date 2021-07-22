import authUser from "../../../apiUtils/authUser";
import { getRoommatesByRoomId } from "../../../apiUtils/database/rooms";

export default async (req, res) => {
  // Get user profile
  const profile = await authUser(req, res);

  if (!profile.room_id) {
    return res.status(200).json({ roommates: [] })
  }

  const roommates = await getRoommatesByRoomId(profile.room_id);

  return res.status(200).json({ profile, roommates });
}