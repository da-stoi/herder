## Herder

__A roommate searching app that ranks possible roommates by how closely they match the questions you answer.__

Herder is very much in beta, things will break! When they do, please please please let me know. Contact details can be found on the website.

If you are an incoming or current WPI student, check the Announcement channel on the WPI Class of 2025 Discord server.

## How to use

1. Login with Discord
2. Go to Profile, and select Edit Profile. Then fill in as many questions as possible and press save changes.
3. Go to Search, select what kind of roommate you are looking for and click Search.
4. That's it! 📈 Now you can see the percentage of how closely you match with other people. You can find a person's discord username and digits on their profile card so you can reach out.

## Planning to contribute?

Environment Variables
| Variable                     |Description                       |
|------------------------------|----------------------------------|
|`NEXT_PUBLIC_DISCORD_AUTH_URI`|Discord auth page URI             |
|`DISCORD_REDIRECT_URI`        |Oauth2 Redirect                   |
|`DISCORD_CLIENT_ID`           |Discord oauth2 app client id      |
|`DISCORD_CLIENT_SECRET`       |Discord oauth2 app client secret  |
|`DATABASE_URL`                |PostgreSQL database connection url|

All API requests require a `x-access-token` header, with the exception of the oauth2 redirect.

### Oauth2 Redirect
> __GET__ `/oauth/redirect`

Redirects to auth page after converting oauth2 code to access token.

__Query Parameters__
|Param     |Description |Required|
|----------|------------|--------|
|`code`	   |Oauth2 code |`true`  |

### Match
> __GET__ `/match`

Returns JSON object of matching users with their percent match.

Query Parameters
|Param      |Description    |Required|
|-----------|---------------|--------|
|`grad_year`|Graduation year|`true`  |
|`pronouns` |Pronouns       |`true`  |

### Questions
> __GET__ `/questions`

Returns JSON object of all profile questions.

### Profile
> __GET__ `/user/profile`

Returns requesting user's full profile.

### Update Profile
> __POST__ `/user/update-profile`

Body should contain all profile questions answered by the user.

Returns updated profile.

---
<p align="center">
  Thank you everyone on the WPI Class of 2025 server!
</p>