import { Avatar, Button, CircularProgress, createMuiTheme, Divider, FormControlLabel, Slider, ThemeProvider, Typography } from "@material-ui/core";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../../styles/Profile.module.css";
import { useMediaPredicate } from "react-media-hook";
import BottomNav from "../../components/BottomNav";
import { muiTheme } from "../../utils/theme";
import axios from "axios";
import Cookies from "js-cookie";
import { ContentWrapper } from "../../utils/ContentWrapper";
import styled from "styled-components";

const SmallWidthWrapper = styled.div`
  margin: 0 auto;
  max-width: 250px;
`

export default function Home() {

  const accessToken = Cookies.get("accessToken");
  const [profile, setProfile] = useState();
  const [previousDormOccupancy, updatePreviousDormOccupancy] = useState(1);
  const [dormOccupancy, updateDormOccupancy] = useState(1);
  const [updatingDormOccupancy, setUpdatingDormOccupancy] = useState(false);
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

  // Convert dorm size answer into number
  const getDormSliderMax = (dormSize) => {
    switch (dormSize) {
      case "single":
        return 1;
      case "double":
        return 2;
      case "triple":
        return 3;
      case "quad":
        return 4;
      case "five":
        return 5;
      case "six":
        return 6;
      case "seven":
        return 7;
      case "eight":
        return 8;
      default:
        return 0;
    }
  }

  // Handle room occupancy slider change
  const handleDormOccupancyChange = (value) => {
    if (value !== dormOccupancy) {
      updateDormOccupancy(value);
      return;
    }

    return;
  }

  // Update room occupancy in database
  const saveDormOccupancy = async () => {

    setUpdatingDormOccupancy(true);

    const updateDormOccupancyReq = await axios({
      method: "POST",
      url: "../api/user/update-profile",
      headers: {
        "x-access-token": accessToken
      },
      data: {
        dorm_occupancy: dormOccupancy
      }
    }).catch(e => {
      return { error: true };
    });

    if (!updateDormOccupancyReq || updateDormOccupancyReq.error) {
      alert("Error updating dorm occupancy");
      return;
    }

    updatePreviousDormOccupancy(updateDormOccupancyReq.data.dorm_occupancy);
    setUpdatingDormOccupancy(false);
  }

  // Get user profile
  useEffect(async () => {

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
    updateDormOccupancy(profileReq.data.dorm_occupancy);
    updatePreviousDormOccupancy(profileReq.data.dorm_occupancy);
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
            {profile.room_id ? (
              <Typography variant="h5">Room: {profile.room_id}</Typography>
            ) : (<div />)}
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
            {/* Temporarily disabling future dorm size selection */}
            {/* {profile.form_answers?.room_size?.value ? (
              <div>
                <br />
                <SmallWidthWrapper>
                  <FormControlLabel
                    control={<Slider
                      defaultValue={1}
                      value={dormOccupancy}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      step={1}
                      marks
                      min={1}
                      max={getDormSliderMax(profile.form_answers.room_size.value)}
                      onChange={(event, value) => handleDormOccupancyChange(value)}
                    />}
                    label="How full is your future dorm?"
                    labelPlacement="top"
                  />
                </SmallWidthWrapper>
                {previousDormOccupancy !== dormOccupancy ? (
                  <div>
                    {updatingDormOccupancy ? (
                      <CircularProgress />
                    ) : (
                      <Button variant="outlined" onClick={() => saveDormOccupancy()}>Save</Button>
                    )}
                    <br />
                  </div>
                ) : (<div />)}
                <br />
                <Divider />
              </div>
            ) : (<div />)} */}
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
