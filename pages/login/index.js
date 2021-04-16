import { Button, createMuiTheme, Snackbar, ThemeProvider, Typography } from "@material-ui/core";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../../styles/Login.module.css";
import { useMediaPredicate } from "react-media-hook";
import { muiTheme } from "../../utils/theme";
import { ContentWrapper } from "../../utils/ContentWrapper";
import MuiAlert from "@material-ui/lab/Alert";
import { useRouter } from "next/router";

// Snackbar Alert
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Login() {

  const [themeStyle, setThemeStyle] = useState({});
  const [darkMode, isDarkMode] = useState(useMediaPredicate("(prefers-color-scheme: dark)") ? true : false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const router = useRouter();

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

  useEffect(() => {
    if (router.isReady) {
      switch (router.query.error) {
        case "no_guild_scope":
          setSnackbarMessage("Guild permission not given. Please login again.");
          break;
        case "no_server_joined":
          setSnackbarMessage("You are not part of an approved Discord server.");
          break;
        case "deauthorized":
          setSnackbarMessage("You have deauthorized Herder. Please login to reauthorize.");
          break;
        default:
          return;
      }
      setSnackbarOpen(true);
    }
  }, [router.isReady]);

  const theme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
      ...muiTheme
    },
  });

  return (
    <div className={styles.container} style={themeStyle}>
      <Head>
        <title>Herder | Login</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <ThemeProvider theme={theme}>
        <ContentWrapper className={styles.textCenter}>
          <Typography variant="h3">Herder</Typography>
          <Typography variant="subtitle1">Find your ideal roommates!</Typography>
          <br />
          <br />
          <br />
          <Button variant="contained" size="large" color="secondary" onClick={() => window.location.href = "../auth"}>
            Login with Discord
          </Button>
          <Snackbar open={snackbarOpen}>
            <Alert severity="error" onClose={() => setSnackbarOpen(false)}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </ContentWrapper>
      </ThemeProvider>
    </div >
  )
}
