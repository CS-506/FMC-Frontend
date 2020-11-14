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
        alert("success", "Your account has been verified!");
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

  function VerificationCode() {
    return ( awaitVerification ?
      <div>
        <TextField
          name="code"
          id="code"
          value={code}
          label="Verification code"
          variant="standard"
          required
          disabled={!awaitVerification}
          helperText="Pleae enter your verification code."
          onChange={codeHandler}
        />
        <br />
        <Button
          color="default"
        >
          RESEND
        </Button>
      </div>
      :
      null
    );
  }

  return (
    <div className={classes.root}>
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
            Register New Account
          </Typography>
          <br />
          <hr />

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
            <Grid container spacing={2}>
              <Grid item sm={12}>
                <TextField
                  name="email"
                  id="email"
                  value={email}
                  label="Email"
                  variant="outlined"
                  required
                  fullWidth
                  autoFocus
                  disabled={awaitVerification}
                  helperText="Please enter UW-Madison email address"
                  onChange={emailHandler}
                  InputProps={{
                    // read-only when awaiting verification
                    readOnly: awaitVerification,
                  }}
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
                  disabled={awaitVerification}
                  required
                  fullWidth
                  onChange={passwordHandler}
                  InputProps={{
                    // read-only when awaiting verification
                    readOnly: awaitVerification,
                  }}
                />
              </Grid>

              <Grid item sm={12}>
              {
                // Don't show password confirmation box 
                // when awaiting verification
                awaitVerification ?
                null
                :
                <TextField
                  name="password2"
                  id="password2"
                  value={password2}
                  label="Confirm password"
                  type="password"
                  variant="outlined"
                  required
                  fullWidth
                  disabled={awaitVerification}
                  helperText={"Please set a password. Your password must " 
                        + "contain at least 8 and no more than 32 characters."}
                  onChange={password2Handler}
                />
              }
              </Grid>

              <Grid item sm={12}>
                <hr />
              </Grid>

              <Grid item sm={12} align="center">
                <VerificationCode />
              </Grid>

              <Grid item sm={12}>
                <Button
                  variant="contained"
                  color={awaitVerification? "secondary" : "primary"}
                  className={classes.register}
                  fullWidth
                  disabled={verified}
                  onClick={awaitVerification? verifyHandler: registerHandler}
                >
                  { awaitVerification ? "VERIFY EMAIL" : "CONFIRM" }
                </Button>
              </Grid>

              <Grid item sm={12}>
                {
                  awaitVerification ?
                  <Button
                    variant="contained"
                    color="default"
                    onClick={cancelHandler}
                    fullWidth
                  >
                    Cancel
                  </Button>
                  :
                  <Button
                    color="default"
                    href="/login"
                    fullWidth
                  >
                    {
                      verified || awaitVerification ? "Log in now" : "I already have an account"
                    }
                  </Button>
                }
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
