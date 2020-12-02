import React, { useState, sendData } from 'react';
import { makeStyles, fade } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Grid from "@material-ui/core/Grid";
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  navbar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    background: '#9c0000',
    color: 'white'
  },
  drawerContainer: {
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },

  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(1, 2),
    marginRight: 0,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButton: {
    background: '#e7e6e8',
    variant: "contained",
    color: "black",
  },
  inputRoot: {
    color: 'inherit',
    variant: "contained",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  inputInput2: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(1)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  menuButton: {
    justify: 'flex-end',
  }
}));


export default function NavBar(props) {
  const classes = useStyles();

  const [keyWord, setKeyWord] = React.useState(" ");
  const [keySubject, setKeySubject] = React.useState(" ");
  const [keyInstructor, setKeyInstructor] = React.useState(" ");

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
    setKeyInstructor(newInst);
  }

  function sendKeyCaller() {
    if (props.atSearchPage)
      props.sendKey(keyWord);
  }

  function sendFilterCaller() {
    if (props.atSearchPage)
      props.sendFilter(keySubject, keyInstructor);
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function TestKeyWord(currkeyWord) {
    return (<div></div>);
  }
  function TestKeySubject(currkeySubject) {
    return (<div></div>);
  }
  function TestKeyInstructor(currkeyInstructor) {
    return (<div></div>);
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={classes.navbar}
        style={{ background: '#d50000' }}
      >
        <Toolbar>
          <Grid container justify="space-between">

            <Grid item >

              <Grid container style={{ marginTop: 5 }}>

                <Grid item>
                  <Typography variant="h6" noWrap>
                    Find My Course
                  </Typography>
                </Grid>

                <Grid item>
                  <div className={classes.search}>
                    <div className={classes.searchIcon}>
                      <SearchIcon />
                    </div>
                    <InputBase
                      placeholder="Search..."
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                      inputProps={{ 'aria-label': 'search' }}
                      onChange={e => saveKey(e.target.value)}
                    />
                  </div>
                </Grid>

                <Grid item>
                  <Link to={{
                    pathname: '/Search',
                    state: {
                      "keyWord": keyWord,
                      "keySubject": " ",
                      "keyInstructor": " ",
                    },
                  }}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button
                      style={{ marginLeft: 10 }}
                      className={classes.searchButton}
                      onClick={() => sendKeyCaller()}
                    >
                      Search
                    </Button>
                  </Link>
                </Grid>

              </Grid>
            </Grid>

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
                    style={{ color: 'white' }}
                    href="/login"
                  >
                    Log in
                  </Button>
                )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className={classes.grow} />

      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{ paper: classes.drawerPaper, }}
        style={{ background: "#b8bec4" }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <br /><br />
          <List>
            <div className={classes.search}>
              <InputBase
                placeholder="Subject..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput2,
                }}
                inputProps={{ 'aria-label': 'search' }}
                onChange={e => saveSubj(e.target.value)}
              />
            </div>
            <br />
            <div className={classes.search}>
              <InputBase
                placeholder="Instructor..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput2,
                }}
                inputProps={{ 'aria-label': 'search' }}
                onChange={e => saveInst(e.target.value)}
              />
            </div>
            <br />
            <Link to={{
              pathname: '/Search',
              state: {
                "keyWord": " ",
                "keySubject": keySubject,
                "keyInstructor": keyInstructor,
              },
            }}
              style={{ textDecoration: 'none' }}
            >
              <Button
                style={{ marginLeft: 145 }}
                className={classes.searchButton}
                onClick={() => sendFilterCaller()}
                width='20ch'
              >
                Filter
              </Button>
            </Link>
          </List>
          <br /><br />
          <Divider />
        </div>
      </Drawer>
      
      <TestKeyWord value={keyWord} />
      <TestKeySubject value={keySubject} />
      <TestKeyInstructor value={keyInstructor} />
    </div>
  );
}
