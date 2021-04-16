import { Button, CircularProgress, createMuiTheme, Divider, ThemeProvider, Typography } from "@material-ui/core";
import Head from "next/head";
import { useEffect, useState } from "react";
import MultipleChoice from "../../components/MultipleChoice";
import Scale from "../../components/Scale"
import SingleChoice from "../../components/SingleChoice";
import TextBox from "../../components/TextBox";
import styles from "../../styles/Home.module.css";
import { useMediaPredicate } from "react-media-hook";
import Dropdown from "../../components/Dropdown";
import { muiTheme } from "../../utils/theme";
import BottomNav from "../../components/BottomNav";
import Cookies from "js-cookie";
import axios from "axios";
import { ContentWrapper } from "../../utils/ContentWrapper";

export default function Home() {

  const [questions, setQuestions] = useState();
  const [originalProfileAnswers, setOriginalProfileAnswers] = useState();
  const [basicProfile, updateBasicProfile] = useState();
  const [profileAnswers, updateProfileAnswers] = useState();
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

  // Get profile and questions
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
    });

    if (!profileReq) {
      alert("Error getting profile");
      return;
    }

    if (profileReq.error) {
      Cookies.remove("accessToken");
      window.location.href = "../login?error=deauthorized";
    }

    const formAnswers = profileReq.data.form_answers;
    let formKeys = Object.keys(formAnswers);
    let oldData = false;

    formKeys.forEach(key => {
      if (typeof formAnswers[key] !== "object") {
        oldData = true;
      }
    });

    if (oldData) {
      formKeys.forEach(key => {
        profileReq.data.form_answers[key] = {
          value: formAnswers[key],
          priority: "1"
        }
      });
    }

    updateBasicProfile({
      first_name: profileReq.data.first_name,
      last_name: profileReq.data.last_name,
      bio: profileReq.data.bio,
      grad_year: profileReq.data.grad_year,
      pronouns: profileReq.data.pronouns,
    })
    updateProfileAnswers(profileReq.data.form_answers);
    setOriginalProfileAnswers({
      first_name: profileReq.data.first_name,
      last_name: profileReq.data.last_name,
      bio: profileReq.data.bio,
      grad_year: profileReq.data.grad_year,
      pronouns: profileReq.data.pronouns,
      ...profileReq.data.form_answers
    });

    const questionsReq = await axios({
      method: "GET",
      url: "../api/questions",
      headers: {
        "x-access-token": accessToken
      }
    });

    if (!questionsReq) {
      alert("Unable to get questions.")
    }

    setQuestions(questionsReq.data);
  }, []);

  // Save changes
  const saveChanges = async () => {
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      alert("You have been logged out. To avoid loosing changes, open this site in another page and login.");
      return;
    }

    const profileReq = await axios({
      method: "POST",
      url: "../api/user/update-profile",
      headers: {
        "x-access-token": accessToken
      },
      data: {
        ...basicProfile,
        profileAnswers
      }
    }).catch(e => {
      return e.data;
    });

    if (!profileReq) {
      alert("Could not update profile. You have been logged out. To avoid loosing changes, open this site in another page and login.");
      return;
    }

    if (profileReq.error) {
      alert(`Error updating profile: ${profileReq.details}`);
      return;
    }

    // Redirect back to profile page
    window.location.href = "../profile";
  }

  const handleAnswer = (id, answer, priority) => {

    if (id === "first_name" || id === "last_name" || id === "bio" || id === "grad_year" || id === "pronouns") {
      updateBasicProfile({
        ...basicProfile,
        [id]: answer
      })
    } else {
      updateProfileAnswers({
        ...profileAnswers,
        [id]: {
          value: answer,
          priority
        }
      })
    }
  }

  return (
    <div className={styles.container} style={themeStyle}>
      <Head>
        <title>Herder | Edit Profile</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <ThemeProvider theme={theme}>
        <ContentWrapper className={styles.bottomMargin}>
          <Typography variant="h4">Edit Profile</Typography>
          <Typography variant="subtitle1">All questions are optional, but make sure you fill out Graduation Year and Pronouns to show up in searches.</Typography>
          <Typography variant="h6">Don't forget to save your changes!</Typography>
          <br />
          <Divider />
          <br />
          {profileAnswers && basicProfile && questions ? (
            <div>
              {questions.map(question => {
                switch (question.type) {
                  case "text":
                    return (<div><TextBox data={{ ...profileAnswers, ...basicProfile }} id={question.id} placeholder={question.placeholder} handleChange={handleAnswer} /><br /><br /></div>);
                  case "textarea":
                    return (<div><TextBox data={{ ...profileAnswers, ...basicProfile }} id={question.id} placeholder={question.placeholder} handleChange={handleAnswer} textarea={true} /><br /><br /></div>);
                  case "scale":
                    return (<div><Scale data={{ ...profileAnswers, ...basicProfile }} question={question.question} id={question.id} scale={question.scale} handleChange={handleAnswer} hasPriority /><br /><br /></div>);
                  case "singleChoice":
                    return (<div><SingleChoice data={{ ...profileAnswers, ...basicProfile }} question={question.question} id={question.id} options={question.options} handleChange={handleAnswer} /><br /><br /></div>);
                  case "multipleChoice":
                    return (<div><MultipleChoice data={{ ...profileAnswers, ...basicProfile }} question={question.question} id={question.id} options={question.options} handleChange={handleAnswer} /><br /><br /></div>);
                  case "dropdown":
                    return (<div><Dropdown data={{ ...profileAnswers, ...basicProfile }} label={question.label} id={question.id} options={question.options} handleChange={handleAnswer} /><br /><br /></div>)
                  default:
                    return "";
                }
              })}
              <Divider />
              <br />
              <Button color="primary" variant="contained" size="large" disabled={JSON.stringify({ ...basicProfile, ...profileAnswers }) === JSON.stringify(originalProfileAnswers)} onClick={() => saveChanges()}>Save Changes</Button>
            </div>
          ) : (<CircularProgress />)}
        </ContentWrapper>
        <BottomNav />
      </ThemeProvider>
    </div>
  )
}
