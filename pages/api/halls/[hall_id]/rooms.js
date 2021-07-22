import { getRoomsByHallId } from "../../../../apiUtils/database/rooms";

export default async (req, res) => {

  const { hall_id } = req.query;

  const rooms = await getRoomsByHallId(hall_id);

  return res.status(200).json(rooms);
}