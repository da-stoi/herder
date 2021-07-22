import query from "./index";

// Get rooms by residence_hall_id
async function getRoomsByHallId(residence_hall) {
  return query(`SELECT * FROM rooms WHERE residence_hall_id = $1 ORDER BY room_id ASC`, [residence_hall]).then(
    res => res.rows
  )
}

// Get rooms by residence_hall_id and room_number
async function getRoomsByNumber(residence_hall, room_number) {
  return query(`SELECT
	*
FROM
	rooms
WHERE
	room_number = $2
	AND residence_hall_id = $1`, [residence_hall, room_number]).then(
    res => res.rows
  )
}

// Get roommates by room_id
async function getRoommatesByRoomId(room_id) {
  return query(`SELECT
	u.discord_id,
	u.avatar,
	u.username,
	u.digits,
	u.first_name,
	u.last_name,
	u.pronouns,
	u.bio,
	a.room_id,
	a.room_number,
	a.floor,
	a.residence_hall_id,
	a.description,
	h.name AS hall_name,
  h.server_invite
FROM
	users u
	LEFT JOIN rooms a USING (room_id)
	LEFT JOIN rooms r USING (room_number, residence_hall_id)
	LEFT JOIN residence_halls h USING (residence_hall_id)
WHERE
	r.room_id = $1`, [room_id]).then(
    res => res.rows
  )
}

export {
  getRoomsByHallId,
  getRoomsByNumber,
  getRoommatesByRoomId
}