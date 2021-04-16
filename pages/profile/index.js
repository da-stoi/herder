import { Avatar, Button, CircularProgress, createMuiTheme, Divider, ThemeProvider, Typography } from "@material-ui/core";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../../styles/Profile.module.css";
import { useMediaPredicate } from "react-media-hook";
import BottomNav from "../../components/BottomNav";
import { muiTheme } from "../../utils/theme";
import axios from "axios";
import Cookies from "js-cookie";
import { ContentWrapper } from "../../utils/ContentWrapper";

export default function Home() {

  const [profile, setProfile] = useState();
  const [themeStyle, setThemeStyle] = useState({});
  const [darkMode, isDarkMode] = useState(useMediaPredicate("(prefers-color-scheme: dark)") ? true : false);

  // Darkmode/lightmode switching
  // Should work, but throws an error. Circle back to this
  // if (darkMode !== useMediaPredicate("(prefers-color-scheme: dark)") ? true : false) {
  //   isDarkMode(useMediaPredicate("(prefers-color-scheme: dark)") ? true : false);
  // }

  useEffect(() => {
    if (darkMode) {
      setThemeStyle({
        backgroundColor: "#212121",
        color: "white"
      })
    }
  }, [darkMode]);


  const theme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
      ...muiTheme
    },
  });

  // Get user profile
  useEffect(async () => {

    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      window.location.replace("../auth");
    }

    const profileReq = await axios({
      method: "GET",
      url: "../api/user/profile",
      headers: {
        "x-access-token": accessToken
      }
    }).catch(e => {
      return { error: true };
    });

    if (!profileReq) {
      alert("Error getting profile");
      return;
    }

    if (profileReq.error) {
      Cookies.remove("accessToken");
      window.location.href = "../login?error=deauthorized";
    }

    setProfile(profileReq.data);
  }, []);

  // Remove accessToken cookie and redirect to login page
  const logout = () => {
    Cookies.remove("accessToken");
    window.location.href = "../login";
  }

  return (
    <div className={styles.container} style={themeStyle}>
      <Head>
        <title>Herder | Profile</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <ThemeProvider theme={theme}>
        {!profile ? (
          <CircularProgress style={{ marginTop: "40px" }} />
        ) : (
          <ContentWrapper>

            <Avatar style={{ width: "80px", height: "80px", margin: "0 auto" }} src={profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.discord_id}/${profile.avatar}.png` : ""} />
            <br />
            <Typography variant="h4">{profile.first_name ? profile.last_name ? `${profile.first_name} ${profile.last_name}` : profile.first_name : ""}</Typography>
            <Typography variant="subtitle1">{profile.username}#{profile.digits}</Typography>
            <br />
            <Divider />
            {profile.bio ? (
              <div>
                <br />
                <Typography variant="subtitle1">{profile.bio}</Typography>
                <br />
                <Divider />
              </div>
            ) : (<div />)}
            <br />
            <Button color="primary" variant="contained" size="large" onClick={() => window.location.href = "../edit-profile"}>Edit Profile</Button>
            <br />
            <br />
            <Button color="secondary" variant="contained" size="large" onClick={() => logout()}>Log Out</Button>
          </ContentWrapper>
        )}
        <BottomNav className="mobile-nav" />
      </ThemeProvider>
    </div>
  )
}
