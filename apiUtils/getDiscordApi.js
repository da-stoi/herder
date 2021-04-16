import axios from "axios";

export default async function getDiscordApi(path, accessToken) {
  const discordReq = await axios({
    method: "GET",
    url: `https://discord.com/api/v8/${path}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      authorization: `Bearer ${accessToken}`
    }
  }).catch(e => {
    return { error: true, status: e.response.status };
  })

  if (discordReq.error) {
    return discordReq
  }

  return discordReq.data;
}