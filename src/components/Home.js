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
import { red } from '@material-ui/core/colors';



const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
      },
    title: {
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
}));

export default function Home() {
    const classes = makeStyles();

    return (
        <div className={classes.root}>
            <Grid 
                container 
                spacing={3}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '80vh' }}
            >
                <Grid item xs={12}>
                    <Typography className={classes.title} variant="h3">
                        Find My Course
                    </Typography>
                </Grid>
                <br/>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
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
                    <Grid item xs={6}>

                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            style={{background: '#d50000', marginLeft: 120}}
                            className={classes.searchButton}
                            /*href="/register"*/
                        >
                            Search 
                        </Button>
                    </Grid>
                </Grid>
                
                    
                
            </Grid>
        </div>
    )
}