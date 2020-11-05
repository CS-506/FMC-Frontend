import React, { useState, sendData } from 'react';
import ReactDOM from 'react-dom';
import { makeStyles, fade } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import Search from './Search';

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
    overflow: 'auto',
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
  inputRoot: {
    color: 'inherit',
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
  }
}));



export default function ClippedDrawer() {
  const classes = useStyles();

  const [keyWord, setKeyWord] = useState("");

  function newSearch(newKeyWord) {
      setKeyWord(newKeyWord)
  }

  function sendData() {
    this.props.parentCallback(keyWord);
  }

  return (
    <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.navbar} style={{ background: '#d50000' }}>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    Find My Course
                </Typography>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                      <SearchIcon />
                    </div>
                    <InputBase
                      placeholder="Search…"
                      classes={{
                          root: classes.inputRoot,
                          input: classes.inputInput,
                      }}
                      inputProps={{ 'aria-label': 'search' }}
                      value={keyWord}
                      onChange={e => newSearch(e.target.value)}
                      
                    />
                </div>
              <p>{keyWord}</p>
              <sendData />
            </Toolbar>
        </AppBar>
        <div className={classes.grow} />
        <inputSearch key={keyWord} />

        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{paper: classes.drawerPaper,}}
            style={{ background: "#b8bec4" }}
        >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <br/><br/>
          <List>
            <div className={classes.search}>
              <InputBase
                placeholder="Subject..."
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput2,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
            <br/>
            <div className={classes.search}>
              <InputBase 
                placeholder="Instructor..."
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput2,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
            <br/>
            <Button
              variant="contained"
              style={{background: '#ff5131', marginLeft: 120}}
              className={classes.searchButton}
              /*href="/register"*/
            >
              Search 
            </Button>
          </List>
          
          <br/><br/>
          <Divider />
          
        </div>
      </Drawer>
    
    </div>
  );
}
