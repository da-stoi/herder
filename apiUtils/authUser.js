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

      const guilds = await axios({
        method: "GET",
        url: "https://discord.com/api/v8/users/@me/guilds",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          authorization: `Bearer ${req.headers["x-access-token"]}`
        }
      })
      if (guilds.error) {
        reject(guilds.error_details);
        return res.status(401).json(guilds)
      }
      var is_in_guild = false;
      for (g in guilds) {
        if (g.id == '788248729412829224') {
          is_in_guild = true;
        }
      }

      if (is_in_guild) {
        const profile = await upsertUser(discordProfile.data);
        if (!profile) {
          return reject("unable to create user")
        }
  
        return resolve(profile)
      } else {
        return reject("Need to join the right server!")
      }


    } else {
      return reject("no access token");
    }
  })
}