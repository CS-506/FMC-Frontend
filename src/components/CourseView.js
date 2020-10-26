import React from "react"
import { makeStyles } from "@material-ui/core/styles";
import { 
    Typography, Paper, Grid, Select
} from "@material-ui/core/";

import NavBar from "./NavBar";

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

export default function CourseView(props) {
    const classes = useStyles();

    /* INPUT STATES ************************************************/

    // course object
    const [course, setCourse] = React.useState();
    // instructors who have taught this course previously
    const [instructors, setInstructors] = React.useState([]);
    // semesters in which this course was offered
    const [semesters, setSemesters] = React.useState([]);


    /* PAGE STATES *************************************************/
    const [isLoading, setLoading] = React.useState(true);


    React.useEffect(() => {
        console.log("React.useEffect");

        /* Dummy course object */
        const courseInfo = {
            cid: 3214232,
            title: "Introduction to Operating Systems",
            dept: "Computer Sciences",
            subject:" COMP SCI",
            code: 537
        };

        setCourse(courseInfo);
        setLoading(false);
    }, []);


    /**
     * Dropdown selection of instructors.
     */
    function InstructorSelect() {
        return (
            <Typography variant="h6">
                Instructor Selection.
            </Typography>
        );
    }

    /**
     * Drop-down selection of semesters.
     */
    function SemesterSelect() {
        return (
            <Typography variant="h6">
                Semester selection.
            </Typography>
        );
    }

    function Main() {
        return (
            <Paper className={classes.contents}>
                <Typography variant="h4">
                    {course.subject} {course.code}
                </Typography>
                <Typography variant="h6">
                    {course.title}
                </Typography>
                <hr />
                <Grid container spacing={2}>
                    <Grid item md={6}>
                        <InstructorSelect />
                    </Grid>                    
                    <Grid item md={6}>
                        <SemesterSelect />
                    </Grid>                    
                </Grid>
            </Paper>
        );
    }

    function LoadMain() {
        return (
            isLoading ?
            <Typography variant="h3">
                Please wait...
            </Typography>
            :
            <Main />
        );
    }

    return (
        <div className = {classes.root}>
            <div>
                <NavBar/>
            </div>
            <LoadMain />
        </div>
    )
}