import query from "./index";

// Update / Insert user
async function upsertUser({ id, username, discriminator, email, avatar }) {
  return query(`INSERT INTO users (discord_id, username, digits, email, avatar)
  VALUES
    ($1, $2, $3, $4, $5) ON CONFLICT ON CONSTRAINT users_pkey DO
    UPDATE
      SET
        username = $2, digits = $3, email = $4, avatar = $5 RETURNING *`, [id, username, discriminator, email, avatar]).then(
    res => res.rows[0]
  )
}

// Update profile questions
async function updateProfile(id, { first_name, last_name, grad_year, pronouns, profileAnswers }) {
  return query(`UPDATE users SET first_name = $2, last_name = $3, grad_year = $4, pronouns = $5, form_answers = $6 WHERE discord_id = $1 RETURNING *`, [id, first_name, last_name, grad_year, pronouns, profileAnswers]).then(
    res => res.rows[0]
  )
}

// Get user by discord_id
async function getUserById(id) {
  return query(`SELECT * FROM users WHERE discord_id = $1`, [id]).then(
    res => res.rows[0]
  )
}

// Get any users who match pronouns and grad_year
async function getMatchEligibleUsers(pronouns, grad_year, id) {
  return query(`SELECT
	discord_id,
  avatar,
	username,
	digits,
	first_name,
	last_name,
	pronouns,
	grad_year,
	form_answers
FROM
	users
WHERE
	pronouns = $1
	AND grad_year = $2 AND form_answers IS NOT NULL AND discord_id != $3`, [pronouns, grad_year, id]).then(
    res => res.rows
  )
}

export {
  getUserById,
  upsertUser,
  getMatchEligibleUsers,
  updateProfile
}