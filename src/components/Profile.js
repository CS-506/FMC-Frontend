import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import pfImage from "./img/default_avatar.jpg";
import NavBar from "./NavBar"
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from '@material-ui/icons/Close';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Axios from "axios";
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
    const paramUser = `/user/get/id/${userId}`;
    Axios.get(paramUser)
      .then((res) => {
        setUser(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        alert("Failed to find user.");
      })
  }

  function loadComments() {
    const userId = Number(props.user.userId);
    const paramComment = `/user/comment/get/userid/${userId}`;
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
      console.log("HERE WE GO!");
      loadUser();
      loadComments();
    }
  }, [props.loginStat, props.user]);

  return (
    <div className={classes.root}>
      {
        redirect ? <Redirect to="/login" /> : null
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
