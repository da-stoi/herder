import { Button, createMuiTheme, Link, ThemeProvider, Typography } from '@material-ui/core';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../../styles/Login.module.css';
import { useMediaPredicate } from "react-media-hook";
import { muiTheme } from '../../utils/theme';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'

export default function Auth() {

  const [themeStyle, setThemeStyle] = useState({});
  const [darkMode, isDarkMode] = useState(useMediaPredicate("(prefers-color-scheme: dark)") ? true : false);
  const router = useRouter();
  const accessTokenCookie = Cookies.get("accessToken");
  const [pageReady, setPageReady] = useState(0);
  const [updating, setUpdating] = useState(true);

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
      ...muiTheme,
      type: darkMode ? "dark" : "light",
    },
  });

  // Get Profile
  if (!pageReady && typeof window !== 'undefined' && router.isReady) {

    // window.history.replaceState({ path: window.location.pathname }, '', window.location.pathname);
    setPageReady(pageReady + 1);
  }

  useEffect(async () => {
    if (typeof window !== 'undefined' && router.isReady) {

      if (!router.query.accessToken && !accessTokenCookie) {
        return window.location.href = process.env.NEXT_PUBLIC_DISCORD_AUTH_URI;
      }

      if (router.query.accessToken) {
        Cookies.set("accessToken", router.query.accessToken);
        window.location.replace("../profile");
      }

      if (accessTokenCookie) {
        window.location.replace("../profile");
      }

      setUpdating(false);
    }
  }, [pageReady]);

  return (
    <div className={styles.container} style={themeStyle}>
      <Head>
        <title>Herder | Auth</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <ThemeProvider theme={theme}>
        <div style={{ maxWidth: "600px", marginTop: "20px", textAlign: "center" }}>

          <Typography variant="h3">Redirecting</Typography>
          <br />
          <Link href="../">Click here if you don't get redirected.</Link>
        </div>
      </ThemeProvider>
    </div>
  )
}
