import React from 'react';
import {
  makeStyles, TextField, Button, Avatar, IconButton,
  Typography, Grid, CssBaseline, Paper, Collapse
} from "@material-ui/core/";
import Alert from "@material-ui/lab/Alert"
import {
  LockOutlined as LockOutlinedIcon,
  Close as CloseIcon,
} from "@material-ui/icons/";
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

  /* Page states */
  const [showAlert, setShowAlert] = React.useState(false); 
  const [alertSeverity, setAlertSeverity] = React.useState("info");
  const [alertText, setAlertText] = React.useState("");

  function alert(severity, text) {
    setAlertSeverity(severity);
    setAlertText(text);
    setShowAlert(true);
  }

  function registerHandler() {
    // test AlertPopup Prop
    alert("success", "Alert module test passed: alert message body.");
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
                  helperText="Please enter UW-Madison email address"
                  onChange={emailHandler}
                />
              </Grid>

              <Grid item sm={12}>
                <TextField
                  name="password"
                  id="password"
                  value={password}
                  label="password"
                  type="password"
                  variant="outlined"
                  required
                  fullWidth
                  onChange={passwordHandler}
                />
              </Grid>

              <Grid item sm={12}>
                <hr />
              </Grid>

              <Grid item sm={12}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.register}
                  fullWidth
                  onClick={registerHandler}
                >
                  REGISTER
                </Button>
              </Grid>

              <Grid item sm={12}>
                <Button
                  color="default"
                  className={classes.login}
                  href="/login"
                  fullWidth
                >
                  I already have an account
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
