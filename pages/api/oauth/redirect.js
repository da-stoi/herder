import axios from "axios"
import { stringify } from 'qs'
import authUser from "../../../apiUtils/authUser";

export default async (req, res) => {

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
      scope: "identify email"
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

  // Auth user to update or add user in database
  req.headers["x-access-token"] = discordProfile.data.access_token;
  await authUser(req, res);

  return res.redirect(`../../auth?accessToken=${discordProfile.data.access_token}`);
}