import { Pool } from "pg";

// Defining database options
const dbOptions = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
};

const pool = new Pool(dbOptions);

export default function query(text, params, callback) {
  return pool.query(text, params, callback);
}

// const struct = {
//   discord_id,
//   username,
//   digits,
//   first_name,
//   last_name,
//   pronouns,
//   grad_year,
//   personality,
//   form_answers,
//   join_date
// }