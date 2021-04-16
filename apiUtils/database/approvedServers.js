import query from "./index";

// Get list of all approved discord servers
async function getApprovedServers() {
  return query(`SELECT guild_id FROM approved_discord_servers`).then(
    res => res.rows
  )
}

export {
  getApprovedServers
}