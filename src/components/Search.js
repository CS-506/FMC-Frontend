import React, { useContext } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { 
    Typography,
    Grid,
    Paper,
    List,
} from "@material-ui/core/";
import { Link } from 'react-router-dom';
import NavBar from "./NavBar";
import { AppContext } from './Home';

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
    paper: {
        margin: theme.spacing(2, 3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
    },
}));

export default function Search(props) {
    const classes = useStyles();

    
    // search keywords:
    const [keyWord, setKeyWord] = React.useState("No keyWord");

    //const [state, dispatch] = useContext(AppContext);
    /*
    const changeInputValue = (newValue) => {
        dispatch({ type: 'UPDATE_INPUT', data: newValue,});
    };
    */
    function newSearch(newKeyWord) {
        setKeyWord(newKeyWord)
    }
    class Parent extends React.Component {
        state = { message: "" }
        callbackFunction = (childData) => {
            this.setState({message: childData})
        };
        render() {
            return (
                <div>
                     <NavBar parentCallback = {this.callbackFunction}/>
                     <Typography variant="h5">
                        Search Result for {props.name}
                        {this.state.message}
                    </Typography>
                </div>
            );
        }
    }


    // course object:
    const [course, setCourse] = React.useState();

    // course list:
    const courseList = [
        {   
            cid: 3214232,
            title: "Introduction to Operating Systems",
            dept: "Computer Sciences",
            subject:" COMP SCI",
            code: 537
        },
        {
            cid: 3214233,
            title: "Software Engineering",
            dept: "Computer Sciences",
            subject:" COMP SCI",
            code: 506
        },
        {
            cid: 3214234,
            title: "Database Management",
            dept: "Computer Sciences",
            subject:" COMP SCI",
            code: 564
        },
    ]

    
    // PAGE STATES: 
    const [isLoading, setLoading] = React.useState(true);

    React.useEffect(() => {
        console.log("React.useEffect");
        setLoading(false);
    }, []);

    return (
        <div className = {classes.root}>
            
            <div>
                <NavBar/>
            </div>
            <div>
                
            </div>
            <main className = {classes.contents}>
                <div>
                    <Typography variant="h5">
                        Search Result for  {keyWord}
                    </Typography>
                    {/*<Parent />*/}
                    {courseList.map(c => (
                        <Link to="/CourseView" style={{ textDecoration: 'none' }}>
                            <Paper
                                className={classes.paper} 
                                style={{ padding:10 }}
                            >
                                <Typography variant="h5">
                                    {c.title}
                                </Typography>
                                <Typography>
                                    {c.subject} {c.code}
                                </Typography>
                            </Paper>
                        </Link>
                    ))}
                </div>
            </main>
            
            
            
        </div>
        
    )
}