import axios from "axios";
import { stringify } from "qs";
import authUser from "../../../apiUtils/authUser";
import getDiscordApi from "../../../apiUtils/getDiscordApi";
import { getApprovedServers } from "../../../apiUtils/database/approvedServers";

export default async (req, res) => {


  if (req.query.error) {
    return res.redirect(`../../login?error=${req.query.error}`);
  }

  if (!req.query.code) {
    return res.status(401).send('No code.');
  }

  // Convert oauth2 code to access token
  const discordProfile = await axios({
    method: "POST",
    url: "https://discord.com/api/v8/oauth2/token",
    data: stringify({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      code: req.query.code,
      grant_type: "authorization_code",
      redirect_uri: process.env.DISCORD_REDIRECT_URI,
      scope: "identify email connections"
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).catch(e => {
    return { error: true, error_description: e.response.data.error_description }
  });

  if (discordProfile.error) {
    return res.status(401).send(discordProfile.error_description ? discordProfile.error_description : 'Error authenticating code.');
  }

  // Get list of all approved discord servers
  let approvedServers = await getApprovedServers();
  approvedServers = approvedServers.map(server => {
    return server.guild_id
  });

  // Get all servers the user has joined
  const allUserServers = await getDiscordApi("users/@me/guilds", discordProfile.data.access_token);

  if (allUserServers.status === 401) {
    return res.redirect("../../login?error=no_guild_scope");
  }

  // Check which approved servers the user joined
  const joinedApprovedServers = allUserServers.filter(server => {
    if (approvedServers.indexOf(server.id) > -1) {
      return true;
    }
    return false;
  });

  if (joinedApprovedServers.length === 0) {
    return res.redirect("../../login?error=no_server_joined");
  }

  // Auth user to update or add user in database
  req.headers["x-access-token"] = discordProfile.data.access_token;
  await authUser(req, res);

  return res.redirect(`../../auth?accessToken=${discordProfile.data.access_token}`);
}