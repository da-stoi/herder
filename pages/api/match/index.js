// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import authUser from "../../../apiUtils/authUser"
import { getQuestions } from "../database/questions";
import { getMatchEligibleUsers } from "../database/user"

export default async (req, res) => {

  if (!req.query.grad_year || !req.query.pronouns) {
    return res.status(204).json({ error: true, details: "no search params" });
  }

  const profile = await authUser(req, res);
  const answers = profile.form_answers

  const questions = await getQuestions();

  const gradYear = req.query.grad_year;
  const pronouns = req.query.pronouns;

  // Get users that match grad_year and pronouns
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
    const strangerAnswers = stranger.form_answers;
    let score = 0;
    let questionCount = 0;
    let questionMatches = [];

    // More points the closer they are to matching answers exactly
    scales.forEach(scale => {

      // Ignore if any data is missing
      if (!scale || (!scale.scale && !scale.answers) || !scale.id || !answers[scale.id] || !strangerAnswers[scale.id]) {
        return;
      }

      const maxScore = scale.scale ? scale.scale : scale.answers.length;
      const scoreDelta = Math.abs(Number(answers[scale.id]) - Number(strangerAnswers[scale.id]));
      const questionPercent = (-scoreDelta + maxScore) / maxScore;

      questionCount++
      score += questionPercent;

      questionMatches.push({
        id: scale.id,
        percent_match: questionPercent
      })
    });

    // Add set amount of points based on exact question match
    exact.forEach(exactQuestion => {
      if (answers[exactQuestion.id] === strangerAnswers[exactQuestion.id]) {
        questionCount++
        score++;

        questionMatches.push({
          id: exactQuestion.id,
          percent_match: 1
        });
      }
    });

    return {
      discord_id: stranger.discord_id,
      username: stranger.username,
      digits: stranger.digits,
      first_name: stranger.first_name,
      last_name: stranger.last_name,
      grad_year: stranger.grad_year,
      pronouns: stranger.pronouns,
      avatar: stranger.avatar,
      percent_match: score === 0 ? 0 : score / questionCount,
      questionMatches,
    }
  });

  res.status(200).json(strangerScores);
}
