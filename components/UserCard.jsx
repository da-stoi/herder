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
import { Divider } from '@material-ui/core';

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

export default function UserCard({ user, questions }) {

  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
        <Typography variant="subtitle1">[Future Bio]</Typography>
        <br />
        <Divider />
        <Typography variant="h6" color="textSecondary" component="p">
          {(user.percent_match * 100).toFixed(0)}% match.
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
          <Typography variant="h6">Match percentage breakdown:</Typography>
          <Typography variant="subtitle1">Shows how close you match on each specific question.</Typography>
          {user.questionMatches.length > 0 && questions ? (user.questionMatches.map(question => {
            return (<div>
              <Divider />
              <br />
              <Typography variant="subtitle1">{questions[question.id]}</Typography>
              <Typography variant="h6">{(question.percent_match * 100).toFixed(0)}%</Typography>
              <br />
            </div>)
          })) : (
            <Typography paragraph>No questions answered</Typography>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
}