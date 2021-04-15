// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import authUser from "../../../apiUtils/authUser"
import { getQuestions } from "../database/questions";
import { getMatchEligibleUsers } from "../database/user"

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
  const pronouns = req.query.pronouns;
  const strangers = await getMatchEligibleUsers(pronouns, gradYear, profile.discord_id);

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

      if (!scale || (!scale.scale && !scale.answers) || !scale.id || !answers[scale.id]?.value || !strangerAnswers[scale.id]?.value) {
        return;
      }

      // Calculate score and percentage
      const maxScore = scale.scale ? scale.scale : scale.answers.length;
      const scoreDelta = Math.abs(Number(answers[scale.id].value) - Number(strangerAnswers[scale.id].value));
      const questionPercent = (-scoreDelta + maxScore) / maxScore;

      // Calculate priority multiplier
      const maxPriority = 3;
      const priorityDelta = Math.abs(Number(answers[scale.id].priority || "1") - Number(strangerAnswers[scale.id].priority || "1"));
      const priorityMultiplier = (-priorityDelta + maxPriority) / maxPriority;

      // Calculate final percentage
      const finalQuestionPercent = questionPercent * priorityMultiplier
      questionCount++
      score += finalQuestionPercent;

      questionMatches.push({
        id: scale.id,
        priority: strangerAnswers[scale.id].priority,
        percent_match: finalQuestionPercent
      })
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
