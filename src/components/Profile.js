import React, { Profiler } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from "@material-ui/core/Avatar";
import pfImage from "./img/default_avatar.jpg";
import NavBar from "./NavBar"
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from '@material-ui/icons/Close';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

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

  const [user, setProfile] = React.useState(userInit);

  const [showAlert, setShowAlert] = React.useState(false);
  const [alertSeverity, setAlertSeverity] = React.useState("warning");
  const [alertText, setAlertText] = React.useState("ALERT");

  function alertUser(severity, msg) {
    setAlertSeverity(severity);
    setAlertText(msg);
    setShowAlert(true);
  }

  function RCTable() {
    return (
      <div>
        <Grid container spacing={3}>
          {user.RC.map(rcItem => (
            <Grid item key={user.RC.indexOf(rcItem)} md={6}>
              <Link
                to={{ pathname: 'course_' }}

                style={{ textDecoration: 'none' }}
                key={user.RC.indexOf(rcItem)}
              >
                <Paper
                  className={classes.rcPaper}
                  style={{ padding: 10, paddingLeft: 20 }}
                  md={3}
                >
                  <Typography variant="subtitle2">
                    {rcItem.subject} {rcItem.code}<br />
                    {rcItem.name}
                  </Typography>
                  <Typography variant="body2">
                    Rating: {rcItem.rate} <br />
                                        Comment: {rcItem.comment}
                  </Typography>
                </Paper>
              </Link>
            </Grid>
          ))}
        </Grid>

      </div>
    );
  }

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

              <Grid container spacing={3}>
                <Grid item>
                  <Avatar className={classes.user_avatar} variant="square" src={pfImage} />
                </Grid>
                <Grid item style={{ padding: 20, marginTop: 150 }}>
                  <Button variant="contained"
                    className={classes.register}
                    style={{ color: 'white', backgroundColor: '#ffc107' }}
                    component={Link}
                    to="/ProfileEditor"
                  >
                    Edit Profile
                  </Button>
                </Grid>
              </Grid>

              <Typography component="h1" variant="h5" style={{ marginBottom: 20 }}>
                Welcome, {user.lastname} ~
                        </Typography>

              <Grid container spacing={3}>
                <Grid item md={6} >
                  <Paper className={classes.paper} style={{ padding: 10 }}>
                    <Typography variant="h5" style={{ padding: 5 }}>
                      Description
                                </Typography>
                    <Typography style={{ marginLeft: 15 }}>{user.description}</Typography>

                  </Paper>
                </Grid>
                <Grid item md={6} >
                  <Paper className={classes.paper} style={{ padding: 10 }}>
                    <Typography variant="h5" style={{ padding: 5 }}>
                      Contact
                                </Typography>
                    <Typography style={{ marginLeft: 15 }}>{user.email}</Typography>
                    <Typography style={{ marginLeft: 15 }}>{user.phone}</Typography>

                  </Paper>
                </Grid>

                <Grid item md={12} >
                  <Paper className={classes.paper} style={{ padding: 10 }}>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography variant="h5" style={{ padding: 5 }}>
                          My Rating and Comments
                                        </Typography>
                      </Grid>
                      <Grid item xs={6} align="right">
                        <Button variant="contained"
                          className={classes.register}
                          style={{ color: 'white', backgroundColor: '#ffc107' }}
                          component={Link}
                          to="/hives"
                        >
                          Manage
                                        </Button>
                      </Grid>
                    </Grid>

                    <RCTable />

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