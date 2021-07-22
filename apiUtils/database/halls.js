import query from "./index";

// Get all halls
async function getAllHalls() {
  return query(`SELECT * FROM residence_halls`).then(
    res => res.rows
  )
}

export {
  getAllHalls
}