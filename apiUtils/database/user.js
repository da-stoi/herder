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
async function updateProfile(id, { first_name, last_name, bio, grad_year, pronouns, profileAnswers }) {
  return query(`UPDATE users SET first_name = $2, last_name = $3, bio = $4, grad_year = $5, pronouns = $6, form_answers = $7 WHERE discord_id = $1 RETURNING *`, [id, first_name, last_name, bio, grad_year, pronouns, profileAnswers]).then(
    res => res.rows[0]
  )
}

// Update user dorm_occupancy
async function updateDormOccupancy(id, dormOccupancy) {
  return query(`UPDATE users SET dorm_occupancy = $2 WHERE discord_id = $1 RETURNING *`, [id, dormOccupancy]).then(
    res => res.rows[0]
  )
}

// Get user by discord_id
async function getUserById(id) {
  return query(`SELECT * FROM users WHERE discord_id = $1`, [id]).then(
    res => res.rows[0]
  )
}

// Get user room data by discord_id
async function getUserRoomById(id) {
  return query(`SELECT
	u.discord_id,
	u.avatar,
	u.username,
	u.digits,
	u.bio,
	r.room_id,
	r.room_number,
	r.floor,
	h.name AS hall_name
FROM
	users u
	LEFT JOIN rooms r USING (room_id)
	LEFT JOIN residence_halls h USING (residence_hall_id)
WHERE
	u.discord_id = $1`, [id]).then(
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
  bio,
	pronouns,
	grad_year,
  dorm_occupancy,
	form_answers
FROM
	users
WHERE
	pronouns = $1
	AND grad_year = $2 AND form_answers IS NOT NULL AND discord_id != $3`, [pronouns, grad_year, id]).then(
    res => res.rows
  )
}

// Update user room
async function updateRoom(id, room_id) {
  return query(`UPDATE users SET room_id = $2 WHERE discord_id = $1 RETURNING *`, [id, room_id]).then(
    res => res.rows[0]
  )
}

// Get users by room_id
async function getUserByRoomId(room_id) {
  return query(`SELECT
	u.discord_id,
	u.avatar,
	u.username,
	u.digits,
	u.bio,
	r.room_id,
	r.room_number,
	r.floor,
	h.name AS hall_name
FROM
	users u
	LEFT JOIN rooms r USING (room_id)
	LEFT JOIN residence_halls h USING (residence_hall_id)
WHERE
	u.room_id = $1`, [room_id]).then(
    res => res.rows
  )
}

export {
  getUserById,
  upsertUser,
  getMatchEligibleUsers,
  updateProfile,
  updateDormOccupancy,
  updateRoom,
  getUserRoomById,
  getUserByRoomId
}