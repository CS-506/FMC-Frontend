import React from "react";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import GroupIcon from "@material-ui/icons/Group";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from '@material-ui/icons/Close';
import Collapse from "@material-ui/core/Collapse";
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Link as RouterLink } from 'react-router-dom';

import Navbar from "./Navbar"

const useStyles = makeStyles(theme => ({
    /* Page style here */
    paper: { 
        padding: "5%",
    },
    form: {

    },
    button: {

    }
}));

export default function ProfileEditor(props) {
    const classes = useStyles();

    /* Input states and handlers*/
    const [id, setId] = React.useState(Number(props.match.params.id));
    const [isNew, setIsNew] = React.useState(Number(props.match.params.id) === 0);
    const [password, setPassword] = React.useState("");
    const passwordHandler = event => setPassword(event.target.value);
    const [firstname, setFirstname] = React.useState("");
    const firstnameHandler = event => setFirstname(event.target.value);
    const [lastname, setLastname] = React.useState("");
    const lastnameHandler = event => setLastname(event.target.value);    

    /* Page states */
    const [showAlert, setShowAlert] = React.useState(false);
    const [alertSeverity, setAlertSeverity] = React.useState("warning");
    const [alertText, setAlertText] = React.useState("ALERT");
    const [saveDisabled, setSaveDisabled] = React.useState(true);
    const [deleteDisabled, setDeleteDisabled] = React.useState(true);
    const [pageTitle, setPageTitle] = React.useState("Hive Editor");
    const [editable, setEditable] = React.useState(false);

    /**
     * Page load:
     * 1. Check if user is logged in. If not, redirect to log in page.
     * 2. Fetch the hive specified by ID, error catching...
     * 3. Display form accordingly, i.e. set state (create vs. edit)
     */
    React.useEffect(() => {
                
        async function fetchUserData() {
            let api = "/api/user/" + props.user.username;
            const user = await axios.get(api).catch(err => {
                let errormsg = "ERROR " + err.response.status
                                + ": Failed to fetch data from server.";
                alertUser("error", errormsg);
                console.log(err);
            });
            if (user.data) {
                console.log(user.data);
                setPassword(user.data.password);
                setFirstname(user.data.firstname);
                setLastname(user.data.lastname);
                
                if (user.data.username === props.user.username) {
                    setEditable(true);
                    setPageTitle("Profile Editor");
                } else {
                    setPageTitle("Profile");
                }
                // Enable buttons
                setDeleteDisabled(false)
                setSaveDisabled(false);
            } else {
                alertUser("warning", "user not found.");
            }
        }

        if (props.loginStat === "NOT_LOGGED_IN") {
            props.history.push("/login");
        }
        if (Number(props.match.params.id) !== 0) {
            console.log("Fetching data...");
            fetchUserData();
        } else {
            setPageTitle("Create a new user account");
            setSaveDisabled(false);
            setEditable(true);
        }
    }, []);

    function alertUser(severity, msg) {
        setAlertSeverity(severity);
        setAlertText(msg);
        setShowAlert(true);
    }

    const submitHandler = variables => {
        setShowAlert(false);
        if (id === 0) {
            alertUser("error", "ID must be a non-zero number.");
            return;
        }

        const inputFields = {
            password: password,
            firstname: firstname,
            lastname: lastname,
        };

        console.log(inputFields);

        axios.post("/api/user", inputFields)
            .catch(err => {
                let errormsg = "ERROR " + err.response.status
                                + ": Failed to create user.";
                alertUser("error", errormsg);
                return;
            });
        alertUser("success", "Saved!");
    }

    const deleteHandler = variables => {
        setShowAlert(false);

        axios.delete("api/user")
            .catch(err => {
                let errormsg = "ERROR " + err.response.status
                                + ": Failed to delete user.";
                alertUser("error", errormsg);
                return;
            });
        alertUser("success", "Hive deleted.");
    }


    return (
        <div>
        <Navbar title="Profile Editor"
                loginStat={props.loginStat}
                user={props.user}/>

        <br />

        <Container maxWidth="md">
        <Paper className="paper">
            <CssBaseline />

            {/* Flexible alert element, see alertUser() */}
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

            <div className={classes.paper}>

                <Typography component="h1" variant="h4">
                    {pageTitle} 
                </Typography>

                <hr />
                <br />

                <form className={classes.form}>
                    <Grid container spacing={2}>

                        <Grid item md={6}>
                            <TextField
                                name="username"
                                id="username"
                                value={username}
                                label="Change Username"
                                variant="outlined"
                                required
                                disabled={!editable}
                                fullWidth
                                onChange={usernameHandler}
                            />
                        </Grid>
                        
                        <Grid item md={6}>
                            <TextField
                                name="password"
                                id="password"
                                type="password"
                                value={password}
                                label="Change Password"
                                variant="outlined"
                                disabled={!editable}
                                required
                                fullWidth
                                onChange={passwordHandler}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <TextField
                                name="firstname"
                                id="firstname"
                                value={firstname}
                                label="Firstname"
                                variant="outlined"
                                disabled={!editable}
                                required
                                fullWidth
                                onChange={firstnameHandler}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <TextField
                                name="lastname"
                                id="lastname"
                                value={lastname}
                                label="Lastname"
                                variant="outlined"
                                disabled={!editable}
                                required
                                fullWidth
                                onChange={lastnameHandler}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <TextField
                                name="email"
                                id="email"
                                value={email}
                                label="Email Address"
                                variant="outlined"
                                disabled={!editable}
                                required
                                fullWidth
                                onChange={emailHandler}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <TextField
                                name="phone"
                                id="phone"
                                value={phone}
                                label="Contact Information"
                                variant="outlined"
                                disabled={!editable}
                                required
                                fullWidth
                                onChange={phoneHandler}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <TextField
                                name="address"
                                id="address"
                                value={address}
                                label="Address"
                                variant="outlined"
                                disabled={!editable}
                                required
                                fullWidth
                                onChange={addressHandler}
                            />
                        </Grid>

                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                        <Grid item md={6}>
                            <Button
                                component={RouterLink}
                                to="/profile"
                                variant="outlined"
                                className={classes.button}
                            >
                                BACK TO Profile 
                            </Button>
                        </Grid>
                        
                        <Grid item md={3}>
                            <Button
                                variant="contained"
                                disabled={deleteDisabled || !editable}
                                fullWidth
                                className={classes.button}
                                onClick={deleteHandler}
                            >
                                DELETE 
                            </Button>
                        </Grid>

                        <Grid item md={3}>
                            <Button
                                variant="contained"
                                color={!isNew ? "primary" : "secondary"}
                                className={classes.button}
                                fullWidth
                                disabled={saveDisabled || !editable}
                                onClick={submitHandler}
                            >
                                {isNew ? "CREATE" : "SAVE"}
                            </Button>
                        </Grid>

                    </Grid>
                </form>
            </div>
        </Paper>
        </Container>
        </div>
    )
}