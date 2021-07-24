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
          <Typography variant="h6" className={styles.textCenter}>A student-made roommate matching website</Typography>
          <br />
          <Divider />
          <Typography variant="h6">Herder is a student-made roommate matching website.</Typography>
          <Typography variant="subtitle1">Things may break! It would be super helpful to report an issue if you see one. You can email me at <Link href="mailto:daniel@stoiber.network">daniel@stoiber.network</Link> or DM me on Discord (da_stoi#4834)</Typography>
          <br />
          <Divider />
          <Typography variant="h6">How to find new roommates</Typography>
          <ol>
            <li>Make sure you are on one of the approved Discord servers. (WPI Main or WPI Class of 2025) Send me a DM (da_stoi#4834) if you need an invite link. Then <Link href="../login">login with Discord</Link>.</li>
            <br />
            <li>Go to <Link href="../profile"><b>Profile</b></Link>, and select <b>Edit Profile</b>. Then fill in as many questions as possible and <b>press save changes</b>.</li>
            <br />
            <li>Go to <Link href="../search"><b>Search</b></Link>, select what kind of roommate you are looking for and click <b>Search</b>.</li>
            <br />
            <li>That's it! 📈 Now you can see the percentage of how closely you match with other people. You can find a person's discord username and digits on their profile card so you can reach out.</li>
          </ol>
          <Divider />
          <Typography variant="h6">How to see your roommates</Typography>
          <ol>
            <li>Click on the Roommates tab at the bottom.</li>
            <br />
            <li>If you haven't selected your room yet, select your residence hall and room.</li>
            <br />
            <li>That's it! Now you can see a list of all the people that have marked themselves as being in the same room.</li>
          </ol>
          <Divider />
          <Typography variant="h6">How to see your neighbors</Typography>
          <ol>
            <li>Click on the Roommates tab at the bottom.</li>
            <br />
            <li>If you haven't selected your room yet, select your residence hall and room.</li>
            <br />
            <li>Select the "My Neighbors" tab at the top.</li>
            <br />
            <li>That's it! Now you can see a list of all the people in your building. You can click on the info icon to see their full profile.</li>
          </ol>
          <Divider />
          <Typography variant="h6">What's new?</Typography>
          <ul>
            <li><b>Neighbors Tab!</b> You can now see a list of all the people in your building.</li>
            <br />
            <li><b>Roommate View!</b> You can now see a list of all of your roommates.</li>
            <br />
            <li><b>Multi-Pronoun Search!</b> You can now select multiple pronouns to search by. Results will be mixed together in match percentage order.</li>
            <br />
            <li><b>Approved Server Checking!</b> Herder now makes sure that only people from approved Discord servers can sign up.</li>
          </ul>
          <Divider />
        </ContentWrapper>
        <Typography variant="subtitle1" className={styles.textCenter}>Made with ❤️ by <Link href="https://daniel.stoiber.network/"><b>Daniel Stoiber</b></Link></Typography>
        <Typography variant="subtitle1" className={styles.textCenter}>Thank you everyone on the WPI Class of 2025 Discord server!</Typography>
        <Typography variant="subtitle1" className={styles.textCenter}><Link href="https://github.com/da-stoi/herder">GitHub Repository</Link> | <Link href="../policies/simple-privacy">Privacy Policy</Link></Typography>
        <br />
        <br />
        <br />
        <br />
        <BottomNav />
      </ThemeProvider>
    </div>
  )
}
