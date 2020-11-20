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
  }
}));

function CommentSection(props) {
  const comments = props.comments;
  return (
    <div>
      <Grid container spacing={3}>
        {comments.map(cmt => (
          <Grid item key={comments.indexOf(cmt)} md={6}>
            <CommentCard
              comment={cmt}
              byUser={props.user ?
                (cmt.userId === props.user.userId) : false}
              reload={props.loadComments}
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

  const rc1 = {
    subject: "COMP SCI",
    code: "506",
    name: "Software Engineering",
    cid: 0,
    rate: 5,
    comment: "Thanks to my awesome teammates"
  }
  const rc2 = {
    subject: "COMP SCI",
    code: "537",
    name: "Operating System",
    cid: 1,
    rate: 5,
    comment: "Professor is nice."
  }
  const userInit = {
    firstname: "Badger",
    lastname: "Penrose",
    description: "Hello World. \nThat nobel prize seems lit.",
    email: "bPenrose@wisc.edu",
    phone: "777-888-9999",
    RC: [rc1, rc2],
  };

  const [user, setUser] = React.useState(userInit);
  const [comments, saveComments] = React.useState([]);


  const [showAlert, setShowAlert] = React.useState(false);
  const [alertSeverity, setAlertSeverity] = React.useState("warning");
  const [alertText, setAlertText] = React.useState("ALERT");

  function alertUser(severity, msg) {
    setAlertSeverity(severity);
    setAlertText(msg);
    setShowAlert(true);
  }

  const loadUser = React.useCallback(() => {
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
  }, []);

  const loadComments = React.useCallback(() => {
    const userId = Number(props.user.userId);
    const paramComment = `/user/comment/get/userid/${userId}`;
    Axios.get(paramComment)
      .then((res) => {
        saveComments(res.data);
      })
      .catch((err) => {
        alert("Failed to fetch comments.");
      })
  }, []);

  React.useEffect(() => {
    loadUser();
    loadComments();
  }, [loadUser, loadComments]);

  return (
    <div className={classes.root}>
      {
        props.loginStat === "NOT_LOGGED_IN" ? <Redirect to="/login" /> : null
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
                    <Typography style={{ marginLeft: 15 }}>
                      {user.email}
                    </Typography>
                    <Typography style={{ marginLeft: 15 }}>
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
                    />

                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </div>
      </main>

    </div>
  )
}
