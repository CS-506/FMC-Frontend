import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { 
    Typography,
    Grid,

} from "@material-ui/core/";
import NavBar from "./NavBar";
import TopBar from "./TopBar"

const useStyles = makeStyles(theme => ({
    navbar: {
        flexGrow: 1,
        zIndex: theme.zIndex.drawer + 1,
    },
    contents: {
        flexGrow: 1,
        paddingTop: theme.spacing(10),
        paddingLeft: theme.spacing(35),
    },
}));

export default function Home() {
    const classes = useStyles();

    return (
        <div className = {classes.root}>
            
            <div>
                {/*<NavBar className={classes.navbar} position="fixed" title="Find My Course" />*/}
                <NavBar/>
            </div>
            <div>
                
            </div>
            <main className = {classes.contents}>
                <div>
                    <Typography variant="h3">
                        Hello World. <br /> 
                        Welcome to Find My Course.
                    </Typography>

                </div>
            </main>
            
            
            
        </div>
        
    )
}