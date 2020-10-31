import React, { useContext } from 'react';
import axios from "axios";
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

    // course list:
    const initList = [
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
    ];

    // search keywords:
    const [keyWord, setKeyWord] = React.useState("No keyWord");
    // course list:
    const [courseList, setList] = React.useState(initList);
    // course object:
    const [course, setCourse] = React.useState();

    //const [state, dispatch] = useContext(AppContext);
    /*
    const changeInputValue = (newValue) => {
        dispatch({ type: 'UPDATE_INPUT', data: newValue,});
    };
    */
    function newSearch(newKeyWord) {
        setKeyWord(newKeyWord)
    }


    

    // Fetch course info from backend given the course id:
    const loadCourse = React.useCallback((courseId) => {
        axios.get("/admin/course/get/" + courseId)
            .then((res) => {
                console.log(res.data);
                setCourse(res.data);
            })
            .catch((err) => {
                alert("Course Loading Error.");
            });
        if (course) {
            setList(courseList.concat(course));
        }
    }, []);
    
    // PAGE STATES: 
    const [isLoading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const cid = 3214232;
        loadCourse(cid);
        setLoading(false);
    }, [loadCourse]);

    function DisplayCourses() {
        return (
            <div >
                {courseList.map(cItem => (
                    <Link to="/course" style={{ textDecoration: 'none' }}>
                        <Paper
                            className={classes.paper} 
                            style={{ padding:10 }}
                        >
                            <Typography variant="h5">
                                {cItem.title}
                            </Typography>
                            <Typography>
                                {cItem.subject} {cItem.code}
                            </Typography>
                        </Paper>
                    </Link>
                ))}
            </div>
        );
    }
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

                    <DisplayCourses />
                </div>
            </main>
            
        </div>
        
    )
}