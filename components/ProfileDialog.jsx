import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Avatar, Divider, Typography } from '@material-ui/core';
import styles from '../styles/Roommates.module.css';
import pronouns from '../utils/pronouns';

export default function ProfileDialog(props) {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(props.state)
  }, [props.state]);

  const handleClose = () => {
    setOpen(false);
    props.updateProfileDialogState(false)
  };

  if (props.user.username) {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="profile-dialog-title"
        aria-describedby="profile-dialog-description"
        style={{ minWidth: 300 }}
      >
        <DialogTitle className={styles.centered} id="profile-dialog-title">
          <Typography variant="h5">{props.user.hall_name} Floor {props.user.floor}</Typography>
          <br />
          <Avatar style={{ width: "80px", height: "80px", margin: "0 auto" }} aria-label="profile picture" src={props.user.avatar ? `https://cdn.discordapp.com/avatars/${props.user.discord_id}/${props.user.avatar}.png` : ""}>
            {props.user.first_name ? props.user.last_name ? `${props.user.first_name.slice(0, 1)}${props.user.last_name.slice(0, 1)}` : props.user.first_name.slice(0, 1) : props.user.username.slice(0, 1)}
          </Avatar>
          <Typography variant="h4">{`${props.user.first_name ? props.user.last_name ? `${props.user.first_name} ${props.user.last_name}` : props.user.first_name : props.user.username}`}</Typography>
          <Typography variant="subtitle2">({pronouns(props.user.pronouns)})</Typography>
          <Typography variant="h5">{props.user.username}#{props.user.digits}</Typography>
        </DialogTitle>
        <DialogContent>
          <Divider />
          <br />
          <DialogContentText id="profile-dialog-description">
            <Typography variant="subtitle1">{props.user.bio}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  } else {
    return <div />
  }
}