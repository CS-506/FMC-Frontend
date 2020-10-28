import React from "react"
import axios from "axios"
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { 
    Typography, Paper, Grid, TextField, MenuItem, InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "@material-ui/core/";
import {
    PeopleAlt as InstructorIcon,
    DateRange as SemesterIcon,
} from "@material-ui/icons"
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
    const [course, setCourse] = React.useState(null);
    // id of instructor currently displayed
    const [iid, setIid] = React.useState(0);
    // instructors who have taught this course previously
    const [instructors, setInstructors] = React.useState([]);
    // semester currently displayed
    const [sem, setSem] = React.useState(0);
    // semesters in which this course was offered
    const [semesters, setSemesters] = React.useState([]);
    // sections offered in the past
    const [sections, setSections] = React.useState([]);

    const iidChange = event => setIid(event.target.value);
    const semChange = event => setSem(Number(event.target.value));


    /* PAGE STATES *************************************************/
    const [isLoading, setLoading] = React.useState(true);

    /**
     * Parse section array fetched from backend.
     */
    function parseSections(sects) {
        console.log("Parsing sections: ");
        console.log(sects);
        setSections(sects);
    }

    /**
     * Fetch course information from backend corresopnding to
     * the given course id of this page, and store it in state.
     */
    const loadCourse = React.useCallback((courseId) => {
        axios.get("/admin/course/get/" + courseId)
            .then((res) => {
                console.log(res.data);
                setCourse(res.data);
            })
            .catch((err) => {
                alert("Unknown error.");
            });
    }, []);

    /**
     * Fetch list of instructors who have taught this course in the past.
     */
    const loadInstructors = React.useCallback((courseId) => {
        axios.get("/coursesection/instructorname/course/" + courseId)
            .then((res) => {
                let instructorInfo = [];
                for (let i = 0; i < res.data.length; i++) {
                    let inst = {
                        iid: res.data[i][0],
                        name: (res.data[i][1] + " " + res.data[i][3]),
                    };
                    instructorInfo.push(inst);
                }
                setInstructors(instructorInfo);
            })
            .catch((err) => {
                alert("Unknown error.");
            });
    }, []);

    /**
     * Extract all unique semesters from a list
     */
    function filterSemesters(sems) {
        let uniqsems = [];
        for (let i = 0; i < sems.length; i++) {
            let sem = {
                year: sems[i][1],
                semester: sems[i][2],
            };
            let unique = true;
            for (let j = 0; j < uniqsems.length; j++) {
                if (uniqsems[j].year === sem.year 
                        && uniqsems[j].semester === sem.semester) {
                    unique = false;
                    break;
                }
            }
            if (unique)
                uniqsems.push(sem);
        }
        return uniqsems;
    }

    /**
     * Fetch list of semesters in which this course has been offered.
     */
    const loadSemesters = React.useCallback((courseId) => {
        axios.get("/coursesection/yearsemester/course/" + courseId)
            .then((res) => {
                const sems = filterSemesters(res.data);
                setSemesters(sems);
            })
            .catch((err) => {
                console.log(err);
                alert("Unknown error whilst retrieving semesters.");
            });
    }, []);

    const loadSections = React.useCallback((courseId) => {
        let url = "/coursesection/section/" 
                    + courseId + "/"
                    + (iid == 0 ? "instructor_all" : iid)
                    + "/year_all/semester_all";
        console.log(url);
        axios.get(url)
            .then((res) => {
                parseSections(res.data);
            })
            .catch((err) => {
                alert("Unknown error.");
            });
    }, [iid])

    React.useEffect(() => {
        /* Fixed dummy course placeholder value */
        const cid = 3;
        loadCourse(cid);
        loadInstructors(cid);
        loadSemesters(cid);
        loadSections(cid);

        setLoading(false);
    }, [loadSemesters, loadSections, loadInstructors, loadCourse]);


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
                helperText="Select an instructor who taught this course"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <InstructorIcon />
                        </InputAdornment>
                    ),
                }}
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
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SemesterIcon />
                        </InputAdornment>
                    ),
                }}
            >
                <MenuItem value={0} key={0}>
                    All semesters
                </MenuItem>
                {semesters?.map(item => (
                    <MenuItem 
                        value={semesters.indexOf(item)} 
                        key={semesters.indexOf(item)}
                    >
                        {item.semester + " " + item.year}
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

    function Charts() {
        return (
            <Grid container spacing={4}>
                <Grid item md={6}>
                    <GPADistroChart />
                </Grid>
                <Grid item md={6}>
                    <GPATrendChart />
                </Grid>
            </Grid>
        );
    }

    const StyledTableCell = withStyles((theme) => ({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell);
    
    const StyledTableRow = withStyles((theme) => ({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }))(TableRow);

    function createData(semester, section, instructor, carbs, protein) {
        return { semester, section, instructor, carbs, protein };
    }

    function getInstructorName(iid) {
        for (let i = 0; i < instructors.length; i++) {
            if (instructors[i].iid == iid)
                return instructors[i].name;
        }
        return "";
    }

    function compileData() {
        let rows = []
        for (let i = 0; i < sections.length; i++) {
            const entry = createData(
                            sections[i].semester + " " + sections[i].year,
                            sections[i].section_code,
                            getInstructorName(sections[i].instructorId),
                            0,
                            0);
            rows.push(entry);
        }
        console.log(rows);
        return rows;
    }

    function SectionTable() {
        const rows = compileData();
        return (
            <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                <TableRow>
                    <StyledTableCell>Semester</StyledTableCell>
                    <StyledTableCell>Section</StyledTableCell>
                    <StyledTableCell>Instructor</StyledTableCell>
                    <StyledTableCell align="right">Carbs&nbsp;(g)</StyledTableCell>
                    <StyledTableCell align="right">Protein&nbsp;(g)</StyledTableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row) => (
                    <StyledTableRow key={rows.indexOf(row)}>
                    <StyledTableCell component="th" scope="row">
                        {row.semester}
                    </StyledTableCell>
                    <StyledTableCell>{row.section}</StyledTableCell>
                    <StyledTableCell>{row.instructor}</StyledTableCell>
                    <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                    <StyledTableCell align="right">{row.protein}</StyledTableCell>
                    </StyledTableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        );
    }

    function DataDisplay() {
        return (
            <div>
            <Charts className={classes.unit} />
            <br />
            <hr />
            <br />
            <SectionTable className={classes.unit} />
            <br />
            </div>
        );
    }

    function Main() {
        return (
            <Paper className={classes.contents}>
                {course?
                    <div className={classes.unit}>
                        <Typography variant="h4">
                            {course.subject.toUpperCase()} {course.code}
                        </Typography>
                        <Typography variant="h6">
                            {course.name}
                        </Typography>
                    </div>
                    :
                    <Typography variant="h4">Loading...</Typography>
                }

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

                <DataDisplay />

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