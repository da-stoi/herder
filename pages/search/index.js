import { Button, Checkbox, CircularProgress, createMuiTheme, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, ThemeProvider, Typography } from "@material-ui/core";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../../styles/Search.module.css";
import { useMediaPredicate } from "react-media-hook";
import Dropdown from "../../components/Dropdown";
import BottomNav from "../../components/BottomNav";
import { muiTheme } from "../../utils/theme";
import UserCard from "../../components/UserCard";
import Cookies from "js-cookie";
import axios from "axios";
import { ContentWrapper } from "../../utils/ContentWrapper";

export default function Home() {

  const [matches, setMatches] = useState();
  const [questions, setQuestions] = useState();
  const [gotMatches, updateGotMatches] = useState(false);
  const [gettingMatches, updateGettingMatches] = useState(false);
  const [gradYear, setGradYear] = useState();
  const [pronouns, setPronouns] = useState({ he: false, she: false, they: false });
  const [themeStyle, setThemeStyle] = useState({});
  const [darkMode, isDarkMode] = useState(useMediaPredicate("(prefers-color-scheme: dark)") ? true : false);

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

  const findMatches = async () => {

    // Gets access token from cookies
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      window.location.replace("../auth");
    }

    updateGotMatches(true);
    updateGettingMatches(true);

    const checkedPronouns = Object.keys(pronouns).filter(pronoun => {
      if (pronouns[pronoun]) {
        return true;
      }

      return false;
    });


    // Gets matches
    const matchReq = await axios({
      method: "GET",
      url: `../api/match?grad_year=${gradYear}&pronouns=${checkedPronouns.join(",")}`,
      headers: {
        "x-access-token": accessToken
      }
    });

    if (!matchReq) {
      window.location.replace("../auth");
    }

    if (matchReq.error) {
      Cookies.remove("accessToken");
      window.location.href = "../login?error=deauthorized";
    }

    // Ranks matches from highest to lowest 
    let strangerMatches = matchReq.data
    strangerMatches.sort((a, b) => {
      return b.percent_match - a.percent_match;
    });

    setMatches(strangerMatches);
    updateGettingMatches(false);

    // Gets questions for percentage breakdown
    const questionsReq = await axios({
      method: "GET",
      url: "../api/questions",
      headers: {
        "x-access-token": accessToken
      }
    });

    if (!questionsReq) {
      alert("Unable to get questions.");
    }

    const reducedQuestions = questionsReq.data.reduce((acc, cur) => {
      acc[cur.id] = cur.question;
      return acc;
    }, {});

    setQuestions(reducedQuestions);
  }

  return (
    <div className={styles.container} style={themeStyle}>
      <Head>
        <title>Herder | Profile</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <ThemeProvider theme={theme}>
        <ContentWrapper className={`${styles.minWidth} ${styles.bottomMargin}`}>
          <Typography variant="h4">Search</Typography>
          <br />
          <Dropdown data={{}} label="Graduation Year" id="grad_year" options={[{ label: "2023", value: "2023" }, { label: "2024", value: "2024" }, { label: "2025", value: "2025" }, { label: "2026", value: "2026" }]} handleChange={(id, value) => setGradYear(value)} />
          <br />
          <br />
          {/* <Dropdown data={{}} label="Pronouns" id="pronouns" options={[{ label: "He/Him", value: "he" }, { label: "She/Her", value: "she" }, { label: "They/Them", value: "they" }]} handleChange={(id, value) => setPronouns(value)} /> */}
          <FormControl component="fieldset">
            <FormLabel component="legend">Pronouns</FormLabel>
            <FormGroup aria-label="pronouns" name="Pronouns" defaultValue="">
              <FormControlLabel
                control={<Checkbox color="primary" checked={pronouns.he} onChange={e => setPronouns({ ...pronouns, he: !pronouns.he })} />}
                label="He/Him"
              />
              <FormControlLabel
                control={<Checkbox color="primary" checked={pronouns.she} onChange={e => setPronouns({ ...pronouns, she: !pronouns.she })} />}
                label="She/Her"
              />
              <FormControlLabel
                control={<Checkbox color="primary" checked={pronouns.they} onChange={e => setPronouns({ ...pronouns, they: !pronouns.they })} />}
                label="They/Them"
              />
            </FormGroup>
          </FormControl>
          <br />
          <br />
          <Button variant="contained" color="primary" size="large" disabled={!gradYear || (!pronouns.he && !pronouns.she && !pronouns.they) ? true : false} onClick={() => findMatches()}>Search</Button>
          <br />
          <br />
          <Divider />
          <br />
          {!gotMatches ? (
            <div />
          ) : (gettingMatches ? (
            <CircularProgress />
          ) : matches && matches.length > 0 ? (
            matches.map(user => {
              return <UserCard user={user} questions={questions} />
            })
          ) : (
            <Typography variant="h5">No matches found :(</Typography>
          )
          )}
        </ContentWrapper>
        <BottomNav className="mobile-nav" />
      </ThemeProvider>
    </div>
  )
}
