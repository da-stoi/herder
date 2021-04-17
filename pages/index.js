import { createMuiTheme, Divider, Link, ThemeProvider, Typography } from "@material-ui/core";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { useMediaPredicate } from "react-media-hook";
import { muiTheme } from "../utils/theme";
import BottomNav from "../components/BottomNav";
import { ContentWrapper } from "../utils/ContentWrapper";

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
        <title>Herder</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <ThemeProvider theme={theme}>
        <ContentWrapper>
          <Typography variant="h3" className={styles.textCenter}>Herder</Typography>
          <Typography variant="h6" className={styles.textCenter}>Herder is a roommate searching app</Typography>
          <br />
          <Divider />
          <Typography variant="h6">Herder will come up in the dictionary if you look up beta testing.</Typography>
          <Typography variant="subtitle1">Things will break! Please please please report it when it does. You can email me at <Link href="mailto:daniel@stoiber.network">daniel@stoiber.network</Link> or DM me on Discord (da_stoi#4834)</Typography>
          <br />
          <Typography paragraph>If you want to see any more questions added to Herder you can suggest them <Link href="https://docs.google.com/spreadsheets/d/1CCfn7HkkL-fNlRznfsVxPP8CnfibsZpYaISL16X7yVc/edit">on this Google Sheet</Link>.</Typography>
          <Divider />
          <Typography variant="h6">How to use it</Typography>
          <ol>
            <li><Link href="../login">Login with Discord</Link></li>
            <br />
            <li>Go to <Link href="../profile"><b>Profile</b></Link>, and select <b>Edit Profile</b>. Then fill in as many questions as possible and <b>press save changes</b>.</li>
            <br />
            <li>Go to <Link href="../search"><b>Search</b></Link>, select what kind of roommate you are looking for and click <b>Search</b>.</li>
            <br />
            <li>That's it! 📈 Now you can see the percentage of how closely you match with other people. You can find a person's discord username and digits on their profile card so you can reach out.</li>
          </ol>
          <Divider />
          <Typography variant="h6">What's new?</Typography>
          <ul>
            <li><b>Dorm Occupancy!</b> You can now let others know how many more roommates you are looking for. (And you won't show up if you've found them all.)</li>
            <br />
            <li><b>Approved Server Checking!</b> Herder now makes sure that only people from approved Discord servers can sign up.</li>
            <br />
            <li><b>Bios!</b> You can now let people know a little more about yourself in 230 characters or less.</li>
            <br />
            <li><b>Question priority!</b> You can now choose how important each question is to you.</li>
          </ul>
          <Divider />
        </ContentWrapper>
        <br />
        <br />
        <Typography variant="subtitle1" className={styles.textCenter}>Made with ❤️ by <Link href="https://daniel.stoiber.network/"><b>Daniel Stoiber</b></Link></Typography>
        <Typography variant="subtitle1" className={styles.textCenter}>Thank you everyone on the WPI Class of 2025 Discord server!</Typography>
        <Typography variant="subtitle1" className={styles.textCenter}><Link href="https://github.com/da-stoi/herder">GitHub Repository</Link></Typography>
        <br />
        <br />
        <br />
        <br />
        <BottomNav />
      </ThemeProvider>
    </div>
  )
}
