import React from "react"
import axios from "axios"
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Typography, Paper, Grid, TextField, MenuItem, InputAdornment, 
  Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow,
} from "@material-ui/core/";
import {
  PeopleAlt as InstructorIcon,
  DateRange as SemesterIcon,
} from "@material-ui/icons";
import {
  Line, Bar
} from "react-chartjs-2";
import { Redirect } from 'react-router';

import NavBar from "./NavBar";
import CommentEditor from "./CommentEditor";
import CommentCard from "./CommentCard";

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
    height: "500px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  rcPaper: {
    flexGrow: 1,
    padding: 10,
    paddingLeft: 20,
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
  // sections after filters are applied
  const [sections, setSections] = React.useState([]);
  // section comments
  const [comments, setComments] = React.useState([]);

  const iidChange = event => setIid(event.target.value);
  const semChange = event => setSem(Number(event.target.value));


  /* PAGE STATES *************************************************/
  const [redirect, setRedirect] = React.useState(false);
  const [isLoading, setLoading] = React.useState(true);
  const [gpaTrendData, setGPATrendData] = React.useState(null);
  const [gradeDistData, setGradeDistData] = React.useState(null);
  const [showCommentEditor, setShowCommentEditor] = React.useState(false);

  /**
   * Fetch course information from backend corresopnding to
   * the given course id of this page, and store it in state.
   */
  const loadCourse = React.useCallback((courseId) => {
    axios.get("/admin/course/get/" + courseId)
      .then((res) => {
        setCourse(res.data);
      })
      .catch((err) => {
        alert("Failed to fetch course information.");
      });
  }, []);

  /**
   * Fetch all sections offered in the past. Should be called
   * ONLY once when the page is first loaded. GPA trend data is
   * derived from this data.
   */
  const loadSectionsAll = React.useCallback((courseId) => {
    let url = "/coursesection/section/"
      + courseId + "/inst_all/year_all/sem_all";
    axios.get(url)
      .then((res) => {
        let sects = processSections(res.data);
        setGPATrendData(compileGPATrend(sects));
      })
      .catch((err) => {
        alert("Failed to fetch list of sections.");
      });
  }, [])

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
        alert("Failed to fetch list of instructors.");
      });
  }, []);

  /**
   * Sort semesters by chronological order. 
   * 
   * Spring < Fall in the same year, for the present time we will assume
   * that semester is either "spring" or "fall".
   */
  function semcomp(sem1, sem2) {
    if (sem1.year != sem2.year) {
      return (sem1.year - sem2.year);
    } else {
      if (sem1.semester === sem2.semester)
        return 0;
      else if (sem1.semester.toLowerCase() === "spring")
        return -1;
      else
        return 1;
    }
  }

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

    // semesters are shown in reverse chronological order (recent -> past)
    uniqsems.sort(semcomp);
    uniqsems.reverse();
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
        alert("Failed to fetch list of semesters.");
      });
  }, []);

  function sectcomp(sect1, sect2) {
    const sem1 = {
      year: sect1.year,
      semester: sect1.semester,
    };
    const sem2 = {
      year: sect2.year,
      semester: sect2.semester,
    };
    return semcomp(sem1, sem2);
  }

  /**
   * Compile historical GPA trend information for graphing.
   * 
   * sects: list of past sections sorted in CHRONOLOGICAL order --
   *        this is required for this function to work.
   */
  function compileGPATrend(sects) {
    let chartData = {
      labels: [],
      datasets: [{
        fill: false,
        lineTension: 0.4,
        backgroundColor: "darkred",
        data: [],
      }]
    }

    let start = 0;
    let end = 0;
    let gpa = 0;
    for (let i = 0; i < sects.length; i++) {
      gpa += sects[i].avg_gpa;
      if (i === sects.length - 1 || sectcomp(sects[i], sects[i + 1]) !== 0) {
        let avg = gpa / (end - start + 1);
        chartData.labels.push(sects[i].semester + " " + sects[i].year);
        chartData.datasets[0].data.push(avg);
        start = i + 1;
        end = start;
        gpa = 0;
      } else {
        end++;
      }
    }
    return chartData;
  }

  /**
   * Compile grade distribution data based on a list of sections.
   */
  function compileGradeDistribution(sects) {
    if (sects.length === 0)
      return null;  // null -> "No data available"

    let distro = [0, 0, 0, 0, 0, 0, 0];

    let chartData = {
      labels: ["A", "AB", "B", "BC", "C", "D", "F"],
      datasets: [{
        fill: false,
        backgroundColor: "darkred",
        data: [],
      }]
    }

    // sum up all percentages
    for (let i = 0; i < sects.length; i++) {
      distro[0] += sects[i].a_num;
      distro[1] += sects[i].ab_num;
      distro[2] += sects[i].b_num;
      distro[3] += sects[i].bc_num;
      distro[4] += sects[i].c_num;
      distro[5] += sects[i].d_num;
      distro[6] += sects[i].f_num;
    }

    // calculate average percentage and add to dataset
    for (let i = 0; i < distro.length; i++) {
      distro[i] = distro[i] ? (distro[i] / sects.length) : 0;
      distro[i] = Math.round(distro[i] * 1e2) / 1e2;
      chartData.datasets[0].data.push(distro[i]);
    }

    return chartData;
  }

  /**
   * Process section information retrieved from backend.
   * Also triggers graph regeneration.
   */
  function processSections(sects) {
    return sects.sort(sectcomp);
  }

  /**
   * Fetch list of sections satisfying the filter parameters
   * (instructor and semester). 
   * Note that when using the sem state value to index the semesters
   * array, the value is decremented by one. See comments above 
   * SemesterSelect() for reason of doing so.
   */
  const loadSections = React.useCallback((courseId) => {
    let url = "/coursesection/section/"
      + courseId + "/"
      + (iid == 0 ? "instructor_all" : iid)
      + (sem == 0 ? "/year_all/sem_all"
        : "/" + semesters[sem - 1].year
        + "/" + semesters[sem - 1].semester);
    axios.get(url)
      .then((res) => {
        let sects = processSections(res.data);
        setSections(sects);
        setGradeDistData(compileGradeDistribution(sects));
      })
      .catch((err) => {
        alert("Failed to fetch list of sections.");
      });
  }, [iid, sem]);

  const loadComments = React.useCallback(() => {
    const courseId = Number(props.match.params.id);
    let url = "/coursesection/scomment/"
      + courseId + "/"
      + (iid == 0 ? "instructor_all" : iid)
      + (sem == 0 ? "/year_all/sem_all"
        : "/" + semesters[sem - 1].year
        + "/" + semesters[sem - 1].semester);
    axios.get(url)
      .then((res) => {
        setComments(res.data);
      })
      .catch((err) => {
        alert("Failed to fetch comments.");
      })
  }, [iid, sem]);

  React.useEffect(() => {
    const cid = Number(props.match.params.id);
    loadCourse(cid);
    loadSectionsAll(cid);
    loadInstructors(cid);
    loadSemesters(cid);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    const cid = Number(props.match.params.id);
    loadSections(cid);
    loadComments();
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
   * NOTE: the mapped key/value are incremented by 1 to avoid collision
   * with the 0 used for "All semesters". This means that when using the
   * value of the Select component to index into the semesters array, 
   * the value should be decremented by 1 in non-zero cases.
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
            value={semesters.indexOf(item) + 1}
            key={semesters.indexOf(item) + 1}
          >
            {item.semester + " " + item.year}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  function GPADistroChart() {
    let yAxisMax = 50;
    if (gradeDistData) {
      let yMax = Math.max(...gradeDistData.datasets[0].data);
      yAxisMax = yMax > 90 ? 100 : (yMax + 10);
    }
    const chartOptions = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            callback: function (value, index, values) {
              return (value + "%");
            },
            suggestedMax: yAxisMax,
          }
        }]
      },
    }
    return (
      <div>
        <h4>Overall Grade Distribution</h4>
        <div className={classes.chart_area}>
          {
            (gradeDistData) ?
              <Bar
                data={gradeDistData}
                width={400}
                height={300}
                options={chartOptions}
              />
              :
              "No data available."
          }
        </div>
      </div>
    );
  }

  function GPATrendChart() {
    const chartOptions = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            suggestedMin: 2.0,
            suggestedMax: 4.0
          }
        }]
      },
    }
    return (
      <div>
        <h4>Historical GPA Trend</h4>
        <div className={classes.chart_area}>
          {
            (gpaTrendData) ?
              <Line
                data={gpaTrendData}
                width={400}
                height={300}
                options={chartOptions}
              />
              :
              "No data available."
          }
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

  function createData(semester, section, instructor,
    a, ab, b, bc, c, d, f, gpa) {
    return {
      semester, section, instructor,
      a, ab, b, bc, c, d, f, gpa
    };
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
        sections[i].a_num, sections[i].ab_num,
        sections[i].b_num, sections[i].bc_num,
        sections[i].c_num, sections[i].d_num,
        sections[i].f_num,
        sections[i].avg_gpa);
      rows.push(entry);
    }
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
              <StyledTableCell align="right">A</StyledTableCell>
              <StyledTableCell align="right">AB</StyledTableCell>
              <StyledTableCell align="right">B</StyledTableCell>
              <StyledTableCell align="right">BC</StyledTableCell>
              <StyledTableCell align="right">C</StyledTableCell>
              <StyledTableCell align="right">D</StyledTableCell>
              <StyledTableCell align="right">F</StyledTableCell>
              <StyledTableCell align="right">GPA</StyledTableCell>
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
                <StyledTableCell align="right">
                  {row.a ? row.a + "%" : ""}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.ab ? row.ab + "%" : ""}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.b ? row.b + "%" : ""}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.bc ? row.bc + "%" : ""}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.c ? row.c + "%" : ""}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.d ? row.d + "%" : ""}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.f ? + row.f + "%" : ""}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.gpa}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  function disableComment() {
    setShowCommentEditor(false);
    loadComments(Number(props.match.params.id));
  }

  function leaveComment() {
    if (props.loginStat === "LOGGED_IN") {
      setShowCommentEditor(true);
    } else {
      setRedirect(true);
    }
  }

  function CommentSection() {
    console.log(comments);
    return (
      <div>
        <Typography variant="h5">
          Comments
        </Typography>
        <br />
        {
          showCommentEditor ? 
          <CommentEditor 
            disable={disableComment} 
            sectionId={sections[0].sectionId}
            userId={props.user.userId}
            key="comment-editor"
          />
          :
          <Button
            variant="contained"
            color="primary"
            onClick={leaveComment}
          >
            Leave a comment
          </Button>
        }
        <br /><br />
        <Grid container spacing={3}>
          {comments.map(cmt => (
            <Grid item key={comments.indexOf(cmt)} md={6}>
              <CommentCard
                comment={cmt}
                byUser={props.user ? 
                        (cmt.userId === props.user.userId) : false}
                reload={loadComments}
              />
            </Grid>
          ))}
        </Grid>
      </div>
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
        <hr />
        <br />
        <CommentSection key="comment-section"/>
        <br />
        <hr />
        <br />
      </div>
    );
  }

  function Main() {
    return (
      <Paper className={classes.contents}>
        {course ?
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
        <DataDisplay key="data-display"/>
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
        <Main key="main"/>
    );
  }

  return (
    <div className={classes.root}>
      {
        redirect ? <Redirect to="/login" /> : null
      }
      <div>
        <NavBar 
          atSerachPage={false} 
          logout={props.logout}
          loginStat={props.loginStat}
          user={props.user}
        />
      </div>
      <LoadMain key="load-main" />
    </div>
  );
}
