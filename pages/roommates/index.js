import { Avatar, Button, Card, CircularProgress, createMuiTheme, Divider, FormControl, InputLabel, MenuItem, Select, ThemeProvider, Typography, Paper, Tabs, Tab, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, IconButton } from "@material-ui/core";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../../styles/Roommates.module.css";
import { useMediaPredicate } from "react-media-hook";
import BottomNav from "../../components/BottomNav";
import { muiTheme } from "../../utils/theme";
import axios from "axios";
import Cookies from "js-cookie";
import { ContentWrapper } from "../../utils/ContentWrapper";
import styled from "styled-components";
import ProfileDialog from "../../components/ProfileDialog";
import { AccountCircleRounded, InfoOutlined, InfoRounded } from "@material-ui/icons";
import pronouns from "../../utils/pronouns";

const SmallWidthWrapper = styled.div`
  margin: 0 auto;
  max-width: 250px;
`

export default function Home() {

  const accessToken = Cookies.get("accessToken");
  const [profile, setProfile] = useState();
  const [rooms, setRooms] = useState({});
  const [roomData, setRoomData] = useState({});
  const [roommates, setRoommates] = useState();
  const [themeStyle, setThemeStyle] = useState({});
  const [darkMode, isDarkMode] = useState(useMediaPredicate("(prefers-color-scheme: dark)") ? true : false);
  const [currentTab, setCurrentTab] = useState(0);
  const [neighborsByFloor, setNeighborsByFloor] = useState([]);

  // Profile Modal
  const [profileDialogData, setProfileDialogData] = useState({});
  const [profileDialogState, updateProfileDialogState] = useState(false);

  // Hall selection state
  const [halls, setHalls] = useState([]);
  const [hall, setHall] = useState("");
  const [allRooms, setAllRooms] = useState([]);
  const [room, setRoom] = useState("");

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


  useEffect(async () => {
    if (!profile || roommates) {

      const hallsReq = await axios({
        method: "GET",
        url: "../api/halls"
      }).catch(e => {
        return { error: true };
      });

      if (!hallsReq) {
        alert("Error getting residence halls");
        return;
      }

      setHalls(hallsReq.data);
    }

  }, [profile, roommates])

  // Get user profile
  useEffect(async () => {

    if (!accessToken) {
      window.location.replace("../auth");
    }

    const roommatesReq = await axios({
      method: "GET",
      url: "../api/roommates",
      headers: {
        "x-access-token": accessToken
      }
    }).catch(e => {
      return { error: true };
    });

    if (!roommatesReq) {
      alert("Error getting roommates");
      return;
    }

    if (roommatesReq.error) {
      Cookies.remove("accessToken");
      window.location.href = "../login?error=deauthorized";
    }

    const occupiedRooms = roommatesReq.data.roommates.reduce((acc, cur) => {

      if (acc[cur.room_id]) {
        acc[cur.room_id].people = [...acc[cur.room_id].people, cur];
      } else {
        acc[cur.room_id] = {
          hall_name: cur.hall_name,
          floor: cur.floor,
          number: cur.number,
          people: [cur]
        }
      }
      return acc;
    }, {});

    setProfile(roommatesReq.data.profile);
    setRoommates(roommatesReq.data.roommates);
    setRooms(occupiedRooms);

    if (roommatesReq.data.roommates.length > 0) {
      setRoomData({
        hall_name: roommatesReq.data.roommates[0].hall_name,
        floor: roommatesReq.data.roommates[0].floor,
        room_number: roommatesReq.data.roommates[0].room_number,
        server_invite: roommatesReq.data.roommates[0].server_invite
      })
    }
  }, []);

  // Get Neighbors
  useEffect(async () => {

    if (!accessToken) {
      window.location.replace("../auth");
    }

    const neighborsReq = await axios({
      method: "GET",
      url: "../api/roommates/neighbors",
      headers: {
        "x-access-token": accessToken
      }
    }).catch(e => {
      return { error: true };
    });

    if (!neighborsReq) {
      alert("Error getting neighbors");
      return;
    }

    if (neighborsReq.error) {
      Cookies.remove("accessToken");
      window.location.href = "../login?error=deauthorized";
    }

    const floors = neighborsReq.data.reduce((acc, cur) => {

      if (acc[cur.floor]) {
        acc[cur.floor] = [...acc[cur.floor], cur];
      } else {
        acc[cur.floor] = [cur]
      }
      return acc;
    }, {});

    setNeighborsByFloor(floors);
  }, []);

  const handleHallSelect = async (e) => {
    setHall(e.target.value);

    const roomsReq = await axios({
      method: "GET",
      url: `../api/halls/${e.target.value}/rooms`
    }).catch(e => {
      return { error: true };
    });

    if (!roomsReq) {
      alert("Error getting rooms");
      return;
    }

    console.log(roomsReq.data)

    setAllRooms(roomsReq.data || []);
  }

  const handleRoomSelect = async (e) => {
    setRoom(e.target.value);
  }

  const updateRoom = async (room_id) => {
    if (!accessToken) {
      window.location.replace("../auth");
    }

    const roommatesReq = await axios({
      method: "POST",
      url: "../api/roommates/update-room",
      headers: {
        "x-access-token": accessToken
      },
      data: {
        room_id
      }
    }).catch(e => {
      return { error: true };
    });

    if (!roommatesReq) {
      alert("Error updating room");
      return;
    }

    if (roommatesReq.error) {
      Cookies.remove("accessToken");
      window.location.href = "../login?error=deauthorized";
    }

    window.location.reload(false);
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const showProfileDialog = (data) => {
    setProfileDialogData(data);
    updateProfileDialogState(true);
  };

  return (
    <div className={styles.container} style={themeStyle}>
      <Head>
        <title>Herder | Roommates</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <ThemeProvider theme={theme}>
        {!roommates ? (
          <CircularProgress style={{ marginTop: "40px" }} />
        ) : roommates.length <= 0 ? (
          <ContentWrapper>
            {/* Room picker */}
            <Typography variant="h4">Roommates</Typography>
            <br />
            <Divider />
            <br />
            <Typography variant="h5">You have not entered your room yet.</Typography>
            <Typography variant="subtitle1">To join a room, first select your Residence Hall.<br />Then select which room you are in.</Typography>
            <br />
            <FormControl
              fullWidth
              variant="outlined"
            >
              <InputLabel id="residence-label">Residence Hall</InputLabel>
              <Select
                className={styles.select}
                labelId="residence-label"
                value={hall}
                labelWidth={110}
                onChange={handleHallSelect}
              >
                <MenuItem value=""><em>Select your Residence Hall</em></MenuItem>
                {halls.map(hall => {
                  return (<MenuItem value={hall.residence_hall_id}>{hall.name}</MenuItem>)
                })}
              </Select>
            </FormControl>
            <br />
            <br />
            {/* Room selection */}
            {allRooms.length > 0 ? (
              <FormControl
                fullWidth
                variant="outlined"
              >
                <InputLabel id="rooms-label">Rooms</InputLabel>
                <Select
                  className={styles.select}
                  labelId="rooms-label"
                  value={room}
                  labelWidth={50}
                  onChange={handleRoomSelect}
                >
                  <MenuItem value=""><em>Select your Room</em></MenuItem>
                  {allRooms.map(room => {
                    return (<MenuItem value={room.room_id}>{room.room_id}</MenuItem>)
                  })}
                </Select>
              </FormControl>
            ) : (<div />)}

            {/* Save button */}
            {room ? (
              <div>
                <br />
                <Button color="primary" variant="contained" size="large" onClick={() => updateRoom(room)}>Join Room</Button>
              </div>
            ) : (<div />)}
          </ContentWrapper>
        ) : (
          <ContentWrapper>
            {/* Roommate display */}
            <div className={styles.header}>
              <Typography variant="h4">Roommates</Typography>
              <br />
              <Paper>
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                >
                  <Tab label="My Roommates" />
                  <Tab label="My Neighbors" />
                </Tabs>
              </Paper>
              <br />
              <Divider />
              <br />
            </div>
            {currentTab === 0 ? (
              <div>
                <Typography variant="h5">{roomData.hall_name}, Floor {roomData.floor}, Room {roomData.room_number}</Typography>
                <Typography variant="subtitle1">Only people who have entered their room in Herder will show up here.</Typography>
                <br />
                {Object.keys(rooms).map(room_id => {
                  const room = rooms[room_id];

                  return (<div>
                    <Divider />
                    <br />
                    <Typography variant="h5">{room_id}</Typography>
                    {room.people.map(person => {
                      return (<div>
                        <Card className={styles.userCard}>
                          <Avatar style={{ width: "80px", height: "80px", margin: "0 auto" }} src={person.avatar ? `https://cdn.discordapp.com/avatars/${person.discord_id}/${person.avatar}.png` : ""} />
                          <br />
                          <Typography variant="h4">{person.first_name ? person.last_name ? `${person.first_name} ${person.last_name}` : person.first_name : ""}</Typography>
                          <Typography variant="subtitle2">({pronouns(person.pronouns)})</Typography>
                          <Typography variant="subtitle1">{person.username}#{person.digits}</Typography>
                          <br />
                          <Button variant="outlined" onClick={() => showProfileDialog(person)}>Full Profile</Button>
                        </Card>
                      </div>)
                    })}
                  </div>)
                })}
                <Divider />
                <br />
                {roomData.server_invite ? (
                  <div>
                    <Button color="secondary" variant="contained" size="large" onClick={() => window.location.href = `https://discord.gg/${roomData.server_invite}`}>Join {roomData.hall_name} Discord</Button>
                    <br />
                    <br />
                  </div>
                ) : (<div />)}
                <Button color="primary" variant="contained" size="large" onClick={() => updateRoom(null)}>Leave Room</Button>
                <br />
                <br />
              </div>
            ) : (
              <div>
                <Typography variant="h5">{roomData.hall_name}</Typography>
                <Typography variant="subtitle1">Only people who have entered their room in Herder will show up here.</Typography>
                <br />
                <Divider />
                <br />
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Avatar aria-label="profile picture">
                            A
                          </Avatar>
                        </TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">Floor</TableCell>
                        <TableCell align="right">More Info</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(neighborsByFloor).map(floor => {
                        const neighbors = neighborsByFloor[floor];
                        return neighbors.map(neighbor => {
                          return (
                            <TableRow key={neighbor.name}>
                              <TableCell component="th" scope="row">
                                <Avatar aria-label="profile picture" src={neighbor.avatar ? `https://cdn.discordapp.com/avatars/${neighbor.discord_id}/${neighbor.avatar}.png` : ""}>
                                  {neighbor.first_name ? neighbor.last_name ? `${neighbor.first_name.slice(0, 1)}${neighbor.last_name.slice(0, 1)}` : neighbor.first_name.slice(0, 1) : neighbor.username.slice(0, 1)}
                                </Avatar>
                              </TableCell>
                              <TableCell align="left">{neighbor.first_name ? neighbor.last_name ? `${neighbor.first_name} ${neighbor.last_name}` : neighbor.first_name : 'n/a'}</TableCell>
                              <TableCell align="left">{neighbor.floor}</TableCell>
                              <TableCell align="right">
                                <IconButton onClick={() => showProfileDialog(neighbor)}>
                                  <InfoOutlined />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <br />
              </div>
            )}
          </ContentWrapper>
        )
        }
        {/* Profile Dialog */}
        <ProfileDialog user={profileDialogData} state={profileDialogState}
          updateProfileDialogState={updateProfileDialogState} />
        <BottomNav className="mobile-nav" />
      </ThemeProvider >
    </div >
  )
}
