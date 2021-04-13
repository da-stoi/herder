import query from "./index";

async function getQuestions() {
  return query(`SELECT value FROM app_settings WHERE key = 'questions'`).then(
    res => res.rows[0].value
  )
}

export {
  getQuestions
}