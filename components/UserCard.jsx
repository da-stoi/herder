import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { useState } from 'react';
import clsx from 'clsx';
import { ExpandMoreRounded, PersonAddRounded, ShareRounded } from '@material-ui/icons';
import { Divider, Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 10,
    maxWidth: 600
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  }
}));

const getDormSize = (dormSize) => {
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

export default function UserCard({ user, questions }) {

  const roommatesLeft = user.form_answers?.room_size?.value ? getDormSize(user.form_answers.room_size.value) - user.dorm_occupancy : 0;
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (roommatesLeft <= 0) {
    return (<div />);
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="profile picture" src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.png` : ""}>
            {user.first_name ? user.last_name ? `${user.first_name.slice(0, 1)}${user.last_name.slice(0, 1)}` : user.first_name.slice(0, 1) : user.username.slice(0, 1)}
          </Avatar>
        }
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        title={user.first_name ? user.last_name ? `${user.first_name} ${user.last_name}` : user.first_name : user.username}
        subheader={`${user.username}#${user.digits}`}
      />
      <CardContent>
        <Typography variant="subtitle1">{user.bio}</Typography>
        <Divider />
        <Typography variant="h6" color="textSecondary" component="p">
          {(user.percent_match * 100).toFixed(0)}% match.
          {user.form_answers?.room_size?.value ? ` ${user.first_name ? user.first_name : user.username}'s dorm needs ${roommatesLeft} more roommate${roommatesLeft === 1 ? "" : "s"}.` : ""}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {/* <IconButton aria-label="add friend">
          <PersonAddRounded />
        </IconButton> */}
        {/* <IconButton aria-label="share">
          <ShareRounded />
        </IconButton> */}
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreRounded />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="h6">Match percentage breakdown</Typography>
          <Typography variant="subtitle1">Shows how close you match on each specific question.</Typography>
          {user.questionMatches.length > 0 && questions ? (user.questionMatches.map(question => {
            return (<div>
              <Divider />
              <br />
              <Typography variant="h6">{questions[question.id]}</Typography>
              {question.priority ? (
                <Typography variant="subtitle1">This is {question.priority === "1" ? "not very" : question.priority === "2" ? "kind of" : "very"} important to them.</Typography>
              ) : (<div />)}
              <Typography variant="h6">{(question.percent_match * 100).toFixed(0)}% match.</Typography>
              <br />
              {question.answer ? (
                <Tooltip title={`Priority Multiplier: ${(question.priority_multiplier * 100).toFixed(0)}%`} placement="right">
                  <Typography variant="overline" style={{ cursor: "default" }}>Raw Match: {(question.raw_percent_match * 100).toFixed(0)}% | Answered: {question.answer}</Typography>
                </Tooltip>
              ) : (<div />)}
            </div>)
          })) : (
            <Typography paragraph>No questions answered</Typography>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
}