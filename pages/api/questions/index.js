import authUser from "../../../apiUtils/authUser";
import { getQuestions } from "../database/questions";

export default async (req, res) => {
  await authUser(req, res);
  const questions = await getQuestions();

  return res.status(200).json(questions);
}