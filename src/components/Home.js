import React, { useState, useReducer } from 'react';
import {
    createMuiTheme,
    makeStyles
} from '@material-ui/core/styles';
import {
    Typography,
    Grid,
    TextField,
    Button,
    InputBase,
    Menu,
    MenuItem,
    IconButton,
} from "@material-ui/core/";
import { red, white } from '@material-ui/core/colors';
import Search from './Search';
import { Link } from 'react-router-dom';
import AccountCircle from '@material-ui/icons/AccountCircle';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        borderColor: "red",
    },
    title: {
    },
    searchBox: {
        outlineColor: red,
        padding: theme.spacing(3),
    },
    searchButton: {
        color: 'white',
    },
}));


// Create context object
export const AppContext = React.createContext();

// Set up Initial State
const initialState = {
    currKeyWord: ''
};

function reducer(state, action) {
    switch (action.type) {
        case 'UPDATE_INPUT':
            return {
                currKeyWord: action.data
            };
        default:
            return initialState;
    }
}



export default function Home(props) {
    const classes = useStyles();

    const [state, dispatch] = useReducer(reducer, initialState);
    const [keyWord, setKeyWord] = React.useState(" ");
    const [keySubject, setKeySubject] = React.useState(" ");
    const [keyInsturctor, setKeyInsturctor] = React.useState(" ");

    const auth = true;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    function saveKey(newKeyWord) {
        setKeyWord(newKeyWord);
    }

    function saveSubj(newSubj) {
        setKeySubject(newSubj);
    }

    function saveInst(newInst) {
        setKeyInsturctor(newInst);
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={classes.root}>

            <Grid container justify="space-between" style={{ marginTop: 15, marginRight: 15 }}>
            <Grid item></Grid>    
            <Grid item>
                {props.loginStat === "LOGGED_IN" ? (
                    <div className={classes.menuButton}>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                            transformorigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>
                                <Link to="/Profile"
                                    style={{ textDecoration: 'none' }}
                                >
                                    Manage My Comments
                      </Link>
                            </MenuItem>

                            <MenuItem onClick={() => props.logout()}>
                                Log out
                    </MenuItem>
                        </Menu>
                    </div>
                ) : (
                        <Button
                            variant="outlined"
                            style={{ color: 'white', background: '#c40d02' }}
                            href="/login"
                        >
                            Log in
                        </Button>
                    )}
            </Grid>
            </Grid>




            <Grid
                container
                spacing={3}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}
            >
                <Grid item xs={12}>
                    <Typography className={classes.title} variant="h3">
                        Find My Course
                    </Typography>
                </Grid>
                <br />
                <Grid container spacing={0}>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={6}>
                        <div className={classes.search}>
                            <AppContext.Provider value={{ state, dispatch }}>
                                <TextField
                                    className={classes.searchbox}
                                    placeholder="Course..."
                                    variant="outlined"
                                    fullWidth
                                    onChange={e => saveKey(e.target.value)}
                                />
                            </AppContext.Provider>
                        </div>
                    </Grid>
                    <Grid item xs={3}></Grid>
                </Grid>
                <Grid item xs={12}>
                    <Link
                        to={{
                            pathname: '/Search',
                            state: {
                                "keyWord": keyWord,
                                "keySubject": " ",
                                "keyInstructor": " ",
                            }
                        }}
                        style={{ textDecoration: 'none' }}
                    >
                        <Button
                            className={classes.searchButton}
                            variant="contained"
                            style={{
                                background: '#c40d02',
                                textDecoration: 'none',
                                marginTop: 10,
                            }}
                            textprimary="true"
                        >
                            Search Course!
                        </Button>
                    </Link>
                </Grid>


            </Grid>
        </div>
    )
}