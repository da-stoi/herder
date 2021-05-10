import authUser from "../../../apiUtils/authUser";
import { getQuestions } from "../../../apiUtils/database/questions";
import { getMatchEligibleUsers } from "../../../apiUtils/database/user";

async function getEligibleUsers(pronouns, gradYear, id) {

  let eligibleUsers = []

  for (const i in pronouns) {
    const pronoun = pronouns[i];
    const users = await getMatchEligibleUsers(pronoun, gradYear, id);
    eligibleUsers = [
      ...eligibleUsers,
      ...users
    ]
  }

  return eligibleUsers;
}

export default async (req, res) => {

  if (!req.query.grad_year || !req.query.pronouns) {
    return res.status(204).json({ error: true, details: "no search params" });
  }

  // Get user profile and questions
  const profile = await authUser(req, res);
  let answers = profile.form_answers;

  // If the user still has the old data format then convert it to the new one
  const userFormAnswers = answers;
  let formKeys = Object.keys(userFormAnswers);
  let oldData = false;

  formKeys.forEach(key => {
    if (typeof userFormAnswers[key] !== "object") {
      oldData = true;
    }
  });

  if (oldData) {
    formKeys.forEach(key => {
      answers[key] = {
        value: userFormAnswers[key],
        priority: "1"
      }
    });
  }

  // Get list of all questions
  const questions = await getQuestions();

  // Get users that match grad_year and pronouns
  const gradYear = req.query.grad_year;
  const pronouns = req.query.pronouns.split(",");
  const strangers = await getEligibleUsers(pronouns, gradYear, profile.discord_id);

  if (!strangers) {
    return res.status(204).json({ error: true, details: "no eligible matches found" });
  }

  // Get all scale questions
  const scales = questions.filter(question => {
    return question.rank_type === "scale" ? true : false;
  }, {});

  // Get all exact matching questions
  const exact = questions.filter(question => {
    return question.rank_type === "exact" ? true : false;
  }, {});

  // Calculate percentages of all match eligible users
  const strangerScores = strangers.map(stranger => {
    let strangerAnswers = stranger.form_answers;
    let score = 0;
    let questionCount = 0;
    let questionMatches = [];

    // If the stranger still has the old data format then convert it to the new one
    const strangerFormAnswers = strangerAnswers;
    let strangerFormKeys = Object.keys(strangerFormAnswers);
    let oldStrangerData = false;

    strangerFormKeys.forEach(key => {
      if (typeof strangerFormAnswers[key] !== "object") {
        oldStrangerData = true;
      }
    });

    if (oldStrangerData) {
      strangerFormKeys.forEach(key => {
        strangerAnswers[key] = {
          value: strangerFormAnswers[key],
          priority: "1"
        }
      });
    }

    // More points the lesser the delta in answers is
    scales.forEach(scale => {

      if (!scale || (!scale.scale && !scale.options) || !scale.id || !answers[scale.id]?.value || !strangerAnswers[scale.id]?.value) {
        return;
      }

      // Calculate score and percentage
      const maxScore = scale.scale ? scale.scale : scale.options.length;
      const scoreDelta = Math.abs(Number(answers[scale.id].value) - Number(strangerAnswers[scale.id].value));
      const questionPercent = (-scoreDelta + maxScore) / maxScore;

      // Calculate priority multiplier
      const maxPriority = 3;
      const priorityDelta = Math.abs(Number(answers[scale.id].priority || "1") - Number(strangerAnswers[scale.id].priority || "1"));
      const priorityPercent = (-priorityDelta + maxPriority) / maxPriority;
      const priorityMultiplier = priorityPercent < 1 ? priorityPercent * 1.2 : priorityPercent

      // Calculate final percentage
      const finalQuestionPercent = questionPercent === 1 ? questionPercent : questionPercent * priorityMultiplier
      questionCount++
      score += finalQuestionPercent;

      questionMatches.push({
        id: scale.id,
        priority: strangerAnswers[scale.id].priority,
        answer: scale.scale ? strangerAnswers[scale.id].value : scale.options[strangerAnswers[scale.id].value - 1].label,
        percent_match: finalQuestionPercent,
        raw_percent_match: questionPercent,
        priority_multiplier: questionPercent === 1 ? 1 : priorityMultiplier,
      });
    });

    // Add 100% match for exact questions
    exact.forEach(exactQuestion => {
      if (answers[exactQuestion.id]?.value === strangerAnswers[exactQuestion.id]?.value) {
        questionCount++
        score++;

        questionMatches.push({
          id: exactQuestion.id,
          percent_match: 1
        });
      }
    });

    return {
      ...stranger,
      percent_match: score === 0 ? 0 : score / questionCount,
      questionMatches,
    }
  });

  res.status(200).json(strangerScores);
}
