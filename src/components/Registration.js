import React from 'react';
import axios from "axios";
import {
  makeStyles, TextField, Button, Avatar, IconButton,
  Typography, Grid, CssBaseline, Paper, Collapse
} from "@material-ui/core/";
import Alert from "@material-ui/lab/Alert"
import {
  LockOutlined as LockOutlinedIcon,
  Close as CloseIcon,
} from "@material-ui/icons/";
import { Redirect } from 'react-router';
import isEmail from "validator/lib/isEmail";
import bgImage from "./img/login_bg.jpg";

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
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
}));

function VerificationCode(props) {
  return ( props.waiting ?
    <div>
      <TextField
        name="code"
        id="code"
        value={props.code}
        label="Verification code"
        variant="standard"
        required
        disabled={!props.waiting}
        helperText="Pleae enter your verification code."
        onChange={props.handler}
      />
      <br />
    </div>
    :
    null
  );
}

function LoginForm(props) {
  const classes = useStyles();
  const [redirect, setRedirect] = React.useState(false);

  function loginRedirect() {
    setRedirect(true);
  }

  return (
  <Paper className={classes.paper}>
    { redirect ? 
      <Redirect
        to={{
          pathname: "/login",
          state: {
            emailField: props.email,
          },
        }} 
      /> : null
    }
    <div className={classes.paper}>
    <Avatar className={classes.avatar}>
      <LockOutlinedIcon />
    </Avatar>
    <Typography component="h1" variant="h5">
      Register New Account
    </Typography>
    <br />
    <hr />

    <Collapse in={props.showAlert}>
      <Alert
        severity={props.alertSeverity}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => { props.setShowAlert(false); }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {props.alertText}
      </Alert>
    </Collapse>

    <br />

    <form className={classes.form}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <TextField
            name="email"
            id="email"
            value={props.email}
            label="Email"
            variant="outlined"
            required
            fullWidth
            autoFocus
            disabled={props.awaitVerification}
            helperText="Please enter UW-Madison email address"
            onChange={props.emailHandler}
            InputProps={{
              // read-only when awaiting verification
              readOnly: props.awaitVerification,
            }}
          />
        </Grid>

        <Grid item sm={12}>
          <TextField
            name="password"
            id="password"
            value={props.password}
            label="Password"
            type="password"
            variant="outlined"
            disabled={props.awaitVerification}
            required
            fullWidth
            onChange={props.passwordHandler}
            InputProps={{
              // read-only when awaiting verification
              readOnly: props.awaitVerification,
            }}
          />
        </Grid>

        <Grid item sm={12}>
        {
          // Don't show password confirmation box when awaiting verification
          props.awaitVerification ? null :
          <TextField
            name="password2"
            id="password2"
            value={props.password2}
            label="Confirm password"
            type="password"
            variant="outlined"
            required
            fullWidth
            disabled={props.awaitVerification}
            helperText={"Please set a password. Your password must " 
                  + "contain at least 8 and no more than 32 characters."}
            onChange={props.password2Handler}
          />
        }
        </Grid>

        <Grid item sm={12}>
          <hr />
        </Grid>

        <Grid item sm={12} align="center">
          <VerificationCode 
            code={props.code}
            waiting={props.awaitVerification} 
            handler={props.codeHandler}
          />
        </Grid>

        <Grid item sm={12}>
          <Button
            variant="contained"
            color={props.awaitVerification? "secondary" : "primary"}
            className={classes.register}
            fullWidth
            disabled={props.verified}
            onClick={props.awaitVerification ? 
                      props.verifyHandler: props.registerHandler}
          >
            { props.awaitVerification ? "VERIFY EMAIL" : "CONFIRM" }
          </Button>
        </Grid>

        <Grid item sm={12}>
          {
            props.awaitVerification ?
            <Button
              variant="contained"
              color="default"
              onClick={props.cancelHandler}
              fullWidth
            >
              Cancel
            </Button>
            :
            <Button
              color="default"
              variant={ props.verified ? "contained" : "text" }
              color={ props.verified ? "primary" : "default" }
              onClick={loginRedirect}
              fullWidth
            >
              { props.verified || props.awaitVerification ? 
                      "Log in now" : "I already have an account" }
            </Button>
          }
        </Grid>
      </Grid>
    </form>
  </div>
  </Paper>
  );
}

export default function Registration(props) {
  const classes = useStyles();

  /* Login States and handlers*/
  const [email, setEmail] = React.useState("");
  const emailHandler = event => setEmail(event.target.value);
  const [password, setPassword] = React.useState("");
  const passwordHandler = event => setPassword(event.target.value);
  const [password2, setPassword2] = React.useState("");
  const password2Handler = event => setPassword2(event.target.value);
  const [code, setCode] = React.useState("");
  const codeHandler = event => setCode(event.target.value);

  /* Page states */
  const [awaitVerification, setAwaitVerification] = React.useState(false);
  const [verified, setVerified] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false); 
  const [alertSeverity, setAlertSeverity] = React.useState("info");
  const [alertText, setAlertText] = React.useState("");

  function alert(severity, text) {
    setAlertSeverity(severity);
    setAlertText(text);
    setShowAlert(true);
  }

  function clearAlert() {
    setShowAlert(false);
  }

  function verifyHandler() {
    axios.put("/user/verifyingUser/" + email.split("@")[0] + "/" + code)
    .then((res) => {
      if (res.data) {
        console.log(res);
        alert("success", "Your account has been verified! Click "
                      + "the button below to login now.");
        setAwaitVerification(false);
        setVerified(true);
      } else {
        alert("warning", "Verifiaction failed.");
      }
    })
    .catch((err) => {
      let errmsg = "ERROR " + err.response.status
                      + ": Failed to verify your code.";
      alert("error", errmsg);
    });
  }

  function verifyUser(username) {
    alert("info", "Please wait...");
    axios.get("/user/sendVerification/" + username)
    .then((res) => {
      console.log(res);
      alert("success", "A verification code has been sent to " + email + ". "
              + "Please enter the code in the field below.");
      setAwaitVerification(true);
    })
    .catch((err) => {
      let errmsg = "ERROR " + err.response.status
                      + ": Failed to send verification.";
      alert("error", errmsg);
    });
  }

  function cancelHandler() {
    setAwaitVerification(false);
  }

  function validateFormData() {
    clearAlert();
    if (email === "") {
      alert("warning", "Please enter your email address.");
    } else if (!isEmail(email)) {
      alert("warning", "Invalid email address.");
      setPassword2("");
    } else if (!email.endsWith("wisc.edu")) {
      alert("warning", "Please use a UW-Madison email address.");
      setPassword2("");
    } else if (password === "") {
      alert("warning", "Please set a password.");
    } else if (password.length < 8) {
      alert("warning", "Password must be at least 8 characters.");
    } else if (password.length > 32) {
      alert("warning", "Password cannot be longer than 32 characters.");
    } else if (password2 !== password) {
      alert("warning", "Password mismatch. Please retype confirmation.");
    } else {
      return true;
    }
    return false;
  }

  function registerUser(regdata) {
    axios.post("/user/add", regdata)
      .then((res) => {
        console.log(res);
        verifyUser(regdata.username);
      })
      .catch((err) => {
        let errmsg = "ERROR " + err.response.status
                       + ": Failed to register new account.";
        alert("error", errmsg);
      });
  }

  function registerHandler() {
    if (!validateFormData())
      return;

    const regdata = {
      username: email.split("@")[0],
      firstName: "Test",
      lastName: "User",
      password: password,
      email: email,
    };

    axios.get("/user/verify/" + regdata.username)
      .then((res) => {
        if (res.data) {
          registerUser(regdata);
        } else {
          alert("warning", "Email already registered.");
          setEmail("");
          setPassword2("");
        }
      })
      .catch((err) => {
        let errmsg = "ERROR " + err.response.status
                       + ": Failed to verify user name.";
        alert("error", errmsg);
      });

  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Grid item className={classes.image}>
        <div className={classes.desktop}>
        <div className={classes.window}>
        <LoginForm 
          showAlert={showAlert}
          alertSeverity={alertSeverity}
          setShowAlert={setShowAlert}
          alertText={alertText}
          email={email}
          emailHandler={emailHandler}
          password={password}
          passwordHandler={passwordHandler}
          password2={password2}
          password2Handler={password2Handler}
          code={code}
          codeHandler={codeHandler}
          verified={verified}
          verifyHandler={verifyHandler}
          registerHandler={registerHandler}
          awaitVerification={awaitVerification}
          cancelHandler={cancelHandler}
        />
        </div>
        </div>
      </Grid>
    </div>
  );
}
