import { upsertUser } from "./database/user";
import getDiscordApi from "./getDiscordApi";

export default async function authUser(req, res) {
  return new Promise(async (resolve, reject) => {

    if (req.headers["x-access-token"]) {

      const discordProfile = await getDiscordApi("users/@me", req.headers["x-access-token"]);
      if (discordProfile.error) {
        reject(discordProfile.error_details);
        return res.status(401).json(discordProfile)
      }

      const profile = await upsertUser(discordProfile);
      if (!profile) {
        return reject("Unable to create user")
      }

      return resolve(profile)
    } else {
      return reject("No access token");
    }
  })
}