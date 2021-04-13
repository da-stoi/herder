import axios from "axios";
import { upsertUser } from "../pages/api/database/user";

export default async function authUser(req, res) {
  return new Promise(async (resolve, reject) => {

    if (req.headers["x-access-token"]) {
      const discordProfile = await axios({
        method: "GET",
        url: "https://discord.com/api/v8/users/@me",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          authorization: `Bearer ${req.headers["x-access-token"]}`
        }
      }).catch(e => {
        return { error: true, error_details: "logged out" };
      })

      if (discordProfile.error) {
        reject(discordProfile.error_details);
        return res.status(401).json(discordProfile)
      }

      const profile = await upsertUser(discordProfile.data);

      if (!profile) {
        return reject("unable to create user")
      }

      return resolve(profile)
    } else {
      return reject("no access token");
    }
  })
}