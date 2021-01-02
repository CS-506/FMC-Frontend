import React from "react";
import Axios from "axios";
import { Redirect } from 'react-router';
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography, Container, Grid, Paper, Collapse, IconButton, Button, 
  DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog,
} from "@material-ui/core";
import {
  Close as CloseIcon, Delete as DeleteIcon
} from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";

import pfImage from "./img/default_avatar.jpg";
import NavBar from "./NavBar"
import CommentCard from "./CommentCard";

const useStyles = makeStyles(theme => ({
  contents: {
    flexGrow: 1,
    paddingTop: theme.spacing(5),
    paddingLeft: theme.spacing(30),
  },
  user_avatar: {
    backgroundImage: pfImage,
    width: "200px",
    height: "200px",
    marginBottom: "20px"
  },
  profilePic: {
    backgroundImage: pfImage,
  },
  rcPaper: {
    flexGrow: 1,
  },
  content: {
    marginLeft: 15,
  },
  button: {
    margin: theme.spacing(1),
  }
}));

function CommentSection(props) {
  const classes = useStyles();
  const comments = props.comments;
  if (comments.length === 0) {
    return (
      <Typography className={classes.content}>
        You don't have any comments.
      </Typography>
    )
  }

  return (
    <div>
      <Grid container spacing={3}>
        {comments.map(cmt => (
          <Grid item key={comments.indexOf(cmt)} md={6}>
            <CommentCard
              comment={cmt}
              byUser={props.user ?
                (cmt.userId === props.user.userId) : false}
              reload={props.reload}
              showTitle={true}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

function OkDialog(props) {
  const [redirect, setRedirect] = React.useState(false);

  const redirTo = {
    pathname: "/Search",
    state: {
      "keyWord": " ",
      "keySubject": " ",
      "keyInstructor": " ",
    },
  };

  function ok() {
    props.close();
    props.logout();
    setRedirect(true);
  }

  return (
    <div>
    { redirect ? <Redirect to={redirTo} /> : null }
    <Dialog 
      open={props.isopen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Deleting your account"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          { props.deleted ?
            "Your account has been deleted. " 
            + "You will now be redirected to the search page." 
            : " Please wait..."
          }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        { !props.deleted ? null : 
          <Button onClick={ok} color="primary">
            OK
          </Button>
        }
      </DialogActions>
    </Dialog>
    </div>
  )
}

function ConfirmDialog(props) {
  return (
    <Dialog
      open={props.isopen}
      onClose={props.close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Delete your account?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you wish to delete your account?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.deregister} color="secondary">
          Yes
        </Button>
        <Button onClick={props.close}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Deregistration(props) {
  const classes = useStyles();

  const [confirmDialog, setConfirmDialog] = React.useState(false);
  const [okDialog, setOkDialog] = React.useState(false);
  const [deleted, setDeleted] = React.useState(false);

  function deregister() {
    setConfirmDialog(false);
    setOkDialog(true);
    console.log("Deleting user: " + props.user.userId);
    Axios.delete("/user/delete/id/" + props.user.userId)
      .then((res) => {
        setDeleted(true);
      })
      .catch((err) => {
        alert("Failed to delete user.");
        closeDialog();
      })
  }

  function closeDialog() {
    setConfirmDialog(false);
    setOkDialog(false);
  }

  return (
    <Paper className={classes.paper} style={{ padding: 10 }}>
      <Typography variant="h5" style={{ padding: 5 }}>
        Delete My Account
      </Typography>
      <Button 
        variant="contained"
        color="secondary"
        size="large"
        className={classes.button}
        startIcon={<DeleteIcon />}
        onClick={() => setConfirmDialog(true)}
      >
        Delete my account
      </Button>
      <ConfirmDialog 
        isopen={confirmDialog}
        close={closeDialog}
        deregister={deregister}
      />
      <OkDialog
        isopen={okDialog}
        close={closeDialog}
        deleted={deleted}
        logout={props.logout}
      />
    </Paper>
  );
}

export default function Profile(props) {
  const classes = useStyles();

  const [user, setUser] = React.useState(null);
  const [comments, saveComments] = React.useState([]);

  const [showAlert, setShowAlert] = React.useState(false);
  const [alertSeverity, setAlertSeverity] = React.useState("warning");
  const [alertText, setAlertText] = React.useState("ALERT");
  const [redirect, setRedirect] = React.useState(false);

  function alertUser(severity, msg) {
    setAlertSeverity(severity);
    setAlertText(msg);
    setShowAlert(true);
  }

  function loadUser() {
    const userId = Number(props.user.userId);
    const paramUser = `/user?userId=${userId}`;

    Axios.get(paramUser)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        alert("Failed to find user.");
      })
  }

  function loadComments() {
    const userId = Number(props.user.userId);
    const paramComment = `/user/comment?userId=${userId}`;
    Axios.get(paramComment)
      .then((res) => {
        saveComments(res.data);
      })
      .catch((err) => {
        alert("Failed to fetch comments.");
      })
  }

  React.useEffect(() => {
    if (props.loginStat === "NOT_LOGGED_IN") {
      setRedirect(true);
    } else if (props.loginStat === "LOGGED_IN" && props.user) {
      loadUser();
      loadComments();
    }
  }, [props.loginStat, props.user]);

  return (
    <div className={classes.root}>
      {
        redirect ? 
        <Redirect
          to={{
            pathname: "/login",
            state: {
              redir: "/profile",
            }
          }}
        /> : null
      }
      <NavBar
        title="Profile"
        loginStat={props.loginStat}
        user={props.user}
        logout={props.logout}
      />
      <Collapse in={showAlert}>
        <Alert
          severity={alertSeverity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setShowAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alertText}
        </Alert>
      </Collapse>

      <br />

      { user !== null ? (
        <main className={classes.contents}>
          <div>
            <Container className={classes.container} maxWidth="lg">
              <Paper style={{ padding: 30, marginTop: 30 }}>

                <Typography component="h1" variant="h5" style={{ marginBottom: 20 }}>
                  Welcome, {user.username}
                </Typography>

                <Grid container spacing={3}>
                  <Grid item md={12} >
                    <Paper className={classes.paper} style={{ padding: 10 }}>
                      <Typography variant="h5" style={{ padding: 5 }}>
                        Email
                      </Typography>
                      <Typography className={classes.content}>
                        {user.email}
                      </Typography>
                      <Typography className={classes.content}>
                        {user.phone}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item md={12} >
                    <Paper className={classes.paper} style={{ padding: 10 }}>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography variant="h5" style={{ padding: 5 }}>
                            My Comments
                          </Typography>
                        </Grid>
                      </Grid>

                      <CommentSection
                        comments={comments}
                        user={user}
                        reload={loadComments}
                      />

                    </Paper>
                  </Grid>

                  <Grid item md={12}>
                    <Deregistration 
                      user={props.user}
                      logout={props.logout}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Container>
          </div>
        </main>
      ) : null
      }
    </div>
  )
}
