import { createMuiTheme, Divider, Link, ThemeProvider, Typography } from "@material-ui/core";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import { useMediaPredicate } from "react-media-hook";
import { muiTheme } from "../../utils/theme";
import { ContentWrapper } from "../../utils/ContentWrapper";
import { CancelOutlined, LockOpenRounded, LockRounded } from "@material-ui/icons";
import styled from "styled-components";

export default function Home() {

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

  return (
    <div className={styles.container} style={themeStyle}>
      <Head>
        <title>Herder | Simple Privacy Policy</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <ThemeProvider theme={theme}>
        <ContentWrapper>
          <Typography variant="h3" className={styles.textCenter} onClick={() => window.location.href = "../"}>Herder</Typography>
          <Typography variant="h6" className={styles.textCenter}>Simple Privacy Policy</Typography>
          {/* <Typography variant="subtitle1" className={styles.textCenter}>The full version of the privacy policy can be found <Link href="../policies/privacy">here</Link>.</Typography> */}
          <br />
          <Divider />
          <br />
          <Typography variant="subtitle1"><LockOpenRounded className={styles.iconWrap} style={{ color: muiTheme.success.main }} /> Data shared with others on Herder.</Typography>
          <Typography variant="subtitle1"><LockRounded className={styles.iconWrap} style={{ color: muiTheme.info.main }} /> Data kept private.</Typography>
          <Typography variant="subtitle1">(A) Data automatically collected.</Typography>
          <Typography variant="subtitle1">(M) Data you manually entered.</Typography>
          <br />
          <Divider />
          <br />
          <Typography variant="subtitle1"><LockOpenRounded className={styles.iconWrap} style={{ color: muiTheme.success.main }} /> (A) Discord Id. (Not directly shared, but transmitted to other users)</Typography>
          <Typography variant="subtitle1"><LockOpenRounded className={styles.iconWrap} style={{ color: muiTheme.success.main }} /> (A) Discord username.</Typography>
          <Typography variant="subtitle1"><LockOpenRounded className={styles.iconWrap} style={{ color: muiTheme.success.main }} /> (A) Discord discriminator. (Digits)</Typography>
          <Typography variant="subtitle1"><LockOpenRounded className={styles.iconWrap} style={{ color: muiTheme.success.main }} /> (A) Discord avatar.</Typography>
          <Typography variant="subtitle1"><LockRounded className={styles.iconWrap} style={{ color: muiTheme.info.main }} /> (A) Email Address (Only if verified on Discord)</Typography>
          <Typography variant="subtitle1"><LockOpenRounded className={styles.iconWrap} style={{ color: muiTheme.success.main }} /> (M) First and Last name. (If provided)</Typography>
          <Typography variant="subtitle1"><LockOpenRounded className={styles.iconWrap} style={{ color: muiTheme.success.main }} /> (M) User bio.</Typography>
          <Typography variant="subtitle1"><LockOpenRounded className={styles.iconWrap} style={{ color: muiTheme.success.main }} /> (M) Profile question answers.</Typography>
          <Typography variant="subtitle1"><LockOpenRounded className={styles.iconWrap} style={{ color: muiTheme.success.main }} /> (M) Current dorm occupancy.</Typography>
          <Typography variant="subtitle1"><LockOpenRounded className={styles.iconWrap} style={{ color: muiTheme.success.main }} /> (M) Graduation year.</Typography>
          <Typography variant="subtitle1"><LockOpenRounded className={styles.iconWrap} style={{ color: muiTheme.success.main }} /> (M) Pronouns.</Typography>
          <Typography variant="subtitle1"><LockRounded className={styles.iconWrap} style={{ color: muiTheme.info.main }} /> (A) Service join date.</Typography>
          <br />
          <Divider />
        </ContentWrapper>
        <br />
        <br />
        <Typography variant="subtitle1" className={styles.textCenter}>Made with ❤️ by <Link href="https://daniel.stoiber.network/"><b>Daniel Stoiber</b></Link></Typography>
        <Typography variant="subtitle1" className={styles.textCenter}>Thank you everyone on the WPI Class of 2025 Discord server!</Typography>
        <Typography variant="subtitle1" className={styles.textCenter}><Link href="https://github.com/da-stoi/herder">GitHub Repository</Link> | <Link href="../policies/simple-privacy">Privacy Policy</Link></Typography>
        <br />
      </ThemeProvider>
    </div>
  )
}
