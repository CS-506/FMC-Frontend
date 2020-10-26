import React from "react"
import { makeStyles } from "@material-ui/core/styles";
import { 
    Typography, Paper, Grid, TextField, MenuItem
} from "@material-ui/core/";
import {
    XYPlot,
    VerticalGridLines, HorizontalGridLines,
    XAxis, YAxis, VerticalBarSeries, LineSeries,
} from "react-vis";
import 'react-vis/dist/style.css';

import NavBar from "./NavBar";

const useStyles = makeStyles(theme => ({
    navbar: {
        flexGrow: 1,
        zIndex: theme.zIndex.drawer + 1,
    },
    contents: {
        flexGrow: 1,
        paddingTop: theme.spacing(11),
        paddingLeft: theme.spacing(37),
        paddingRight: theme.spacing(7),
    },
    unit: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    chart_area: {
        padding: theme.spacing(1),
        paddingRight: theme.spacing(3),
        // border: "1px solid black",
        height: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
}));

export default function CourseView(props) {
    const classes = useStyles();

    /* INPUT STATES ************************************************/
// course object
    const [course, setCourse] = React.useState();
    // id of instructor currently displayed
    const [iid, setIid] = React.useState(0);
    // instructors who have taught this course previously
    const [instructors, setInstructors] = React.useState([]);
    // semester currently displayed
    const [sem, setSem] = React.useState(0);
    // semesters in which this course was offered
    const [semesters, setSemesters] = React.useState([]);

    const iidChange = event => setIid(Number(event.target.value));
    const semChange = event => setSem(Number(event.target.value));


    /* PAGE STATES *************************************************/
    const [isLoading, setLoading] = React.useState(true);


    React.useEffect(() => {
        /* Dummy course object */
        const courseInfo = {
            cid: 3214232,
            title: "Introduction to Operating Systems",
            dept: "Computer Sciences",
            subject:" COMP SCI",
            code: 537
        };
        setCourse(courseInfo);

        /* Dummy instructors list */
        const instructorInfo = [
            { iid: 1, name: "Remzi Arpaci-Dusseau" },
            { iid: 2, name: "Andrea Arpaci-Dusseau" },
            { iid: 3, name: "Mike Swift" },
            { iid: 4, name: "Shivaram Venkataraman" }
        ];
        setInstructors(instructorInfo);

        /* Dummy semesters list */
        const semesterInfo = [
            { year: 2019, period: "Spring" },
            { year: 2019, period: "Fall" },
            { year: 2018, period: "Spring" },
            { year: 2018, period: "Fall" },
            { year: 2017, period: "Fall" }
        ]; setSemesters(semesterInfo);

        setLoading(false);
    }, []);


    /**
     * Dropdown selection of instructors.
     */
    function InstructorSelect() {
        return (
            <TextField
                id="instructor-select" 
                select
                fullWidth
                label="Instructor"
                value={iid}
                onChange={iidChange}
                helperText="Select an instructor who taugth this course"
            >
                <MenuItem value={0} key={0}>
                    All instructors
                </MenuItem>
                {instructors?.map(item => (
                    <MenuItem value={item.iid} key={item.iid}>
                        {item.name}
                    </MenuItem>
                ))}
            </TextField>
        );
    }

    /**
     * Drop-down selection of semesters.
     */
    function SemesterSelect() {
        return (
            <TextField
                id="semester-select" 
                select
                fullWidth
                label="Semester"
                value={sem}
                onChange={semChange}
                helperText="Select a semester where this course was offered"
            >
                <MenuItem value={0} key={0}>
                    All semesters
                </MenuItem>
                {semesters?.map(item => (
                    <MenuItem 
                        value={semesters.indexOf(item)} 
                        key={semesters.indexOf(item)}
                    >
                        {item.period + " " + item.year}
                    </MenuItem>
                ))}
            </TextField>
        );
    }

    function GPADistroChart() {
        /* Dummy GPA distribution data */
        const data = [
            {x: "A", y: 0.45},
            {x: "AB", y: 0.13},
            {x: "B", y: 0.3},
            {x: "BC", y: 0.03},
            {x: "C", y: 0.01},
            {x: "CD", y: 0},
            {x: "D", y: 0.01},
            {x: "F", y: 0.01},
          ];
        return (
            <div>
                <h4>Overall Grade Distribution</h4>
                <div className={classes.chart_area}>
                    <XYPlot     
                        xType="ordinal" 
                        height={470} width={500}
                    >
                        <XAxis />
                        <YAxis tickFormat={v => `${v * 100}%`}/>
                        <VerticalGridLines />
                        <HorizontalGridLines style={{ fontSize: "10pt" }}/>
                        <VerticalBarSeries data={data} color="darkred" />
                    </XYPlot>
                </div>
            </div>
        );
    }

    function GPATrendChart() {
        /* Dummy GPA trend data */
        const data = [
            {x: "FA 17", y: 3.58},
            {x: "SP 18", y: 3.13},
            {x: "FA 18", y: 3.3},
            {x: "SP 19", y: 3.03},
            {x: "FA 19", y: 3.01},
            {x: "SP 20", y: 3.33},
          ];
        return (
            <div>
                <h4>Historical GPA Trend</h4>
                <div className={classes.chart_area}>
                    <XYPlot 
                        xType="ordinal" 
                        height={470} width={500}
                        yDomain={[1.0, 4.0]}
                    >
                        <XAxis />
                        <YAxis />
                        <VerticalGridLines />
                        <HorizontalGridLines style={{ fontSize: "10pt" }}/>
                        <LineSeries data={data} color="darkred" />
                    </XYPlot>
                </div>
            </div>
        );

    }

    function Main() {
        return (
            <Paper className={classes.contents}>
                <div className={classes.unit}>
                    <Typography variant="h4">
                        {course.subject} {course.code}
                    </Typography>
                    <Typography variant="h6">
                        {course.title}
                    </Typography>
                </div>

                <hr />
                
                <div className={classes.unit}>
                <Grid container spacing={2}>
                    <Grid item md={6}>
                        <InstructorSelect />
                    </Grid>                    
                    <Grid item md={6}>
                        <SemesterSelect />
                    </Grid>                    
                </Grid>
                </div>

                <hr />

                <div className={classes.unit}>
                <Grid container spacing={4}>
                    <Grid item md={6}>
                        <GPADistroChart />
                    </Grid>
                    <Grid item md={6}>
                        <GPATrendChart />
                    </Grid>
                </Grid>
                </div>

                <hr />

                <br />
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