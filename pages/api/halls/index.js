import { getAllHalls } from "../../../apiUtils/database/halls";

export default async (req, res) => {

  const halls = await getAllHalls();

  return res.status(200).json(halls);
}