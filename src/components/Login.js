import React from 'react';
import axios from "axios";
import {
  makeStyles, TextField, Button, Avatar, IconButton,
  Typography, Grid, CssBaseline, Paper, Collapse,
} from "@material-ui/core/";
import Alert from "@material-ui/lab/Alert"
import {
  LockOutlined as LockOutlinedIcon,
  Close as CloseIcon,
} from "@material-ui/icons/";
import isEmail from "validator/lib/isEmail";
import bgImage from "./img/login_bg.jpg";
import { Redirect } from 'react-router';

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%",
  },
  desktop: {
    backgroundColor: "transparent",
    boxShadow: "none",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  window: {
    maxWidth: "600px",
  },
  paper: {
    margin: theme.spacing(12, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    height: '100%',
    width: "100%",
    position: "fixed",
    backgroundImage: `url(${bgImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor: theme.palette.type === 'light' ? 
                    theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
}));


export default function Login(props) {
  const classes = useStyles();

  /* Login States and handlers*/
  let [email, setEmail] = React.useState("");
  const emailHandler = event => setEmail(event.target.value);
  const [password, setPassword] = React.useState("");
  const passwordHandler = event => setPassword(event.target.value);

  /* Page states */
  const [redirect, setRedirect] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertSeverity, setAlertSeverity] = React.useState("info");
  const [alertText, setAlertText] = React.useState("");

  React.useEffect(() => {
    if (props.location.state && props.location.state.emailField)
      setEmail(props.location.state.emailField);
  }, [])

  function alert(severity, text) {
    setAlertSeverity(severity);
    setAlertText(text);
    setShowAlert(true);
  }

  function clearAlert() {
    setShowAlert(false);
  }

  function validateFormData() {
    clearAlert();
    if (email === "") {
      alert("warning", "Please enter your email address.");
    } else if (!isEmail(email)) {
      alert("warning", "Invalid email address.");
    } else if (!email.endsWith("wisc.edu")) {
      alert("warning", "Please use a UW-Madison email address.");
    } else if (password === "") {
      alert("warning", "Please enter your password.");
    } else {
      return true;
    }
    return false;
  }

  function setUserId(loginData) {
    axios.get("/user/get/username/" + loginData.username)
      .then((res) => {
        console.log(res);
        loginData.userId = res.data.userId;
        props.auth(loginData);
        alert("success", "Success. Redirecting...");
        setRedirect(true);
      }) 
      .catch((err) => {
        let errmsg = "ERROR " + err.response.status
                       + ": Failed to fetch data from server.";
        alert("error", errmsg);
        return -1;
      })
  }

  const loginHandler = variables => {
    if (!validateFormData())
      return;
    
    let loginData = {
      username: email.split("@")[0],
      email: email,
      password: password,
      userId: 0,
    };

    axios.post("/user/login", {
      username: email.split("@")[0],
      password: password,
    })
    .then((res) => {
      console.log(res);
      if (res.data) {
        setUserId(loginData);
      } else {
        alert("error", "Email or password incorrect.");
        setPassword("");
      }
    })
    .catch((err) => {
      let errmsg = "ERROR " + err.response.status
                      + ": Failed to fetch data from server.";
      alert("error", errmsg);
    });
  }

  console.log(props.location.state);
  const redirTo = 
    props.location.state && props.location.state.redir ? {
      pathname: props.location.state.redir,
    } : {
      pathname: "/Search",
      state: {
        "keyWord": " ",
        "keySubject": " ",
        "keyInstructor": " ",
      },
    };

  return (
    <div className={classes.root}>
      { redirect ? <Redirect to={redirTo} /> : null }
      <CssBaseline />
      <Grid item className={classes.image}>
        <div className={classes.desktop}>
          <div className={classes.window}>
            <Paper className={classes.paper}>

              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Log In
                </Typography>
                <hr />
                <br />

                <Collapse in={showAlert}>
                  <Alert
                    severity={alertSeverity}
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => { setShowAlert(false); }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                  >
                    {alertText}
                  </Alert>
                </Collapse>

                <br />

                <form className={classes.form}>
                  <Grid container spacing={4}>
                    <Grid item sm={12}>
                      <TextField
                        name="email"
                        id="email"
                        value={email}
                        label="Email"
                        variant="outlined"
                        required
                        fullWidth
                        onChange={emailHandler}
                      />
                    </Grid>

                    <Grid item sm={12}>
                      <TextField
                        name="password"
                        id="password"
                        value={password}
                        label="Password"
                        type="password"
                        variant="outlined"
                        required
                        fullWidth
                        onChange={passwordHandler}
                      />
                    </Grid>

                    <Grid item sm={12} md={6}>
                      <Button
                        variant="contained"
                        color="secondary"
                        className={classes.register}
                        fullWidth
                        href="/register"
                      >
                        REGISTER
                      </Button>
                    </Grid>

                    <Grid item sm={12} md={6}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.login}
                        onClick={loginHandler}
                        fullWidth
                      >
                        LOG IN
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </div>
            </Paper>
          </div>
        </div>
      </Grid>
    </div>
  );
}
