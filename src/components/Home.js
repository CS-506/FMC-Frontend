import React from 'react';
import { createMuiTheme, 
    makeStyles 
} from '@material-ui/core/styles';
import { 
    Typography,
    Grid,
    TextField,
    Button,
    InputBase,
} from "@material-ui/core/";
import { red, white } from '@material-ui/core/colors';

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
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(1)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: '20ch',
        },
    },
    searchButton: {
        color: 'white',
    },
}));

export default function Home() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
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
                <br/>
                <Grid container spacing={0}>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={6}>
                        <div className={classes.search}>
                            <TextField
                                className={classes.searchbox}
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                                variant="outlined"
                                fullWidth
                                autoComplete
                            />
                        </div>
                    </Grid>
                    <Grid item xs={3}></Grid>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        className={classes.searchButton}
                        variant="contained"
                        style={{background: '#c40d02'}}
                        
                        textPrimary
                        /*href="/register"*/
                    >
                        Search Course!
                    </Button>
                </Grid>
                <br/>
                <Grid container spacing={0}>
                    <Grid item xs={3}></Grid>
                    <Grid item xs={3}>
                        <TextField
                            className={classes.searchbox}
                            placeholder="Subject..."
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            variant="outlined"
                            
                            autoComplete
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            className={classes.searchbox}
                            placeholder="Instructor..."
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            variant="outlined"
                            
                            autoComplete
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        className={classes.searchButton}
                        variant="contained"
                        style={{background: '#c40d02'}}
                        
                        textPrimary
                        /*href="/register"*/
                    >
                        Search by filters!
                    </Button>
                </Grid>
                    
                
            </Grid>
        </div>
    )
}