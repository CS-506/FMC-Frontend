import React from "react"
import axios from "axios"
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Typography, Paper, Grid, TextField, MenuItem, InputAdornment, 
  Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Checkbox, FormControlLabel, Switch, FormGroup,
} from "@material-ui/core/";
import {
  PeopleAlt as InstructorIcon,
  DateRange as SemesterIcon,
  UnfoldLess as ShowLessIcon,
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

function GPADistroChart(props) {
  const classes = useStyles();
  let yAxisMax = 50;
  if (props.data) {
    let yMax = Math.max(...props.data.datasets[0].data);
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
          (props.data) ?
            <Bar
              data={props.data}
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

function GPATrendChart(props) {
  const classes = useStyles();
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
      <h4>Cumulative Historical GPA Trend</h4>
      <div className={classes.chart_area}>
        <Line
          data={props.data}
          width={400}
          height={300}
          options={chartOptions}
        />
      </div>
    </div>
  );
}

function Charts(props) {
  if (props.sections.length === 0)  {
    return (
      <Typography variant="subtitle2">
        No charts available
      </Typography>
    );
  }
  return (
    <Grid container spacing={4}>
      <Grid item md={6}>
        <GPADistroChart 
          data={props.distData}
        />
      </Grid>
      <Grid item md={6}>
        <GPATrendChart 
          data={props.trendData}
        />
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

function SectionTableRow(props) {
  const row = props.row;
  if (!row)
    return null;
  return (
    <StyledTableRow>
      <StyledTableCell component="th" scope="row">
        {row.semester}
      </StyledTableCell>
      <StyledTableCell>{row.section}</StyledTableCell>
      <StyledTableCell>{row.instructor}</StyledTableCell>
      <StyledTableCell align="right">
        {row.a + "%"}
      </StyledTableCell>
      <StyledTableCell align="right">
        {row.ab + "%"}
      </StyledTableCell>
      <StyledTableCell align="right">
        {row.b + "%"}
      </StyledTableCell>
      <StyledTableCell align="right">
        {row.bc + "%"}
      </StyledTableCell>
      <StyledTableCell align="right">
        {row.c + "%"}
      </StyledTableCell>
      <StyledTableCell align="right">
        {row.d + "%"}
      </StyledTableCell>
      <StyledTableCell align="right">
        {row.f + "%"}
      </StyledTableCell>
      <StyledTableCell align="right">
        {row.gpa}
      </StyledTableCell>
    </StyledTableRow>
  );
}

function SectionTable(props) {
  const classes = useStyles();
  const MAXSECTIONS = 10;
  const TAILNUM = 4;

  const [sects, setSects] = React.useState([]);
  const [showAll, setShowAll] = React.useState(false);
  const [lastRows, setLastRows] = React.useState([]);

  React.useEffect(() => {
    let rows = props.rows;
    setLastRows([]);
    if (!showAll) {
      if (rows.length > MAXSECTIONS) {
        let last = rows.slice(rows.length - TAILNUM, rows.length);
        setLastRows(last);
        rows = rows.slice(0, MAXSECTIONS - TAILNUM);
      } 
    }
    setSects(rows);
  }, [props.rows, showAll]);

  if (props.rows.length === 0) {
    return (
      <Typography variant="subtitle2">
        Section data not available.
      </Typography>
    )
  }

  return (
    <div>
    <Typography variant="h5">
      Section Data (Total: {props.rows.length})
    </Typography>

    { props.rows.length > MAXSECTIONS ? (
      <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox 
                checked={showAll}
                onChange={(e) => setShowAll(e.target.checked)}
                color="primary"
                label="show all"
              />
            }
            label="Show all"
          />
      </FormGroup>
    ) : <br />
    }

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
          { sects.map((row) => (
            <SectionTableRow row={row} key={sects.indexOf(row)} />
          ))}
          { /* This is stupid */
            !showAll && lastRows.length > 0 ? (
            <StyledTableRow>
              <StyledTableCell>...</StyledTableCell>
              <StyledTableCell />
              <StyledTableCell />
              <StyledTableCell />
              <StyledTableCell />
              <StyledTableCell />
              <StyledTableCell />
              <StyledTableCell />
              <StyledTableCell />
              <StyledTableCell />
              <StyledTableCell />
            </StyledTableRow>
            ) : null
          }
          { /* This is also stupid */
            !showAll && lastRows.length > 0 ? lastRows.map((row) => (
              <SectionTableRow row={row} key={lastRows.indexOf(row)} />
            )) : null
          }
        </TableBody>
      </Table>
    </TableContainer>

    { props.rows.length <= MAXSECTIONS || showAll ? (
      <Typography variant="subtitle2">
        <br />
        (All sections shown.)
      </Typography>
      ) : null
    }

    { props.rows.length > MAXSECTIONS && showAll ? (
        <Button 
          onClick={() => {
            setShowAll(false);
          }}
          color="default"
          variant="outlined"
          style={{ marginTop: 10 }}
          startIcon={<ShowLessIcon />}
        >
          Show less
        </Button>
      ) : null
    }
    </div>
  );
}

function CommentSection(props) {
  if (props.sections.length === 0) {
    return (
      <Typography variant="subtitle2">
        Comment section not available.
      </Typography>
    );
  }

  const comments = props.comments;
  return (
    <div>
      <Typography variant="h5">
        Comments
      </Typography>
      <br />
      {
        props.showEditor ? 
        <CommentEditor 
          disable={props.disableComment} 
          sectionId={props.sections[0].sectionId}
          userId={props.user.userId}
        />
        :
        <Button
          variant="contained"
          color="primary"
          onClick={props.leaveComment}
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
              reload={props.loadComments}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

function DataDisplay(props) {
  const classes = useStyles();
  const sectionTableRows = props.compileData();

  return (
    <div>
      <Charts 
        className={classes.unit} 
        sections={props.sections}
        distData={props.gradeDistData}
        trendData={props.gpaTrendData}
      />

      <br /> <hr /> <br />

      <SectionTable 
        className={classes.unit} 
        rows={sectionTableRows}
      />

      <br /> <hr /> <br />

      <CommentSection 
        comments={props.comments}
        showEditor={props.showCommentEditor}
        disableComment={props.disableComment}
        sections={props.sections}
        user={props.user}
        leaveComment={props.leaveComment}
        loadComments={props.loadComments}
      />

      <br /> <hr /> <br />

    </div>
  );
}

/**
 * Dropdown selection of instructors.
 */
function InstructorSelect(props) {
  return (
    <TextField
      id="instructor-select"
      select
      fullWidth
      label="Instructor"
      value={props.data}
      onChange={props.update}
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
      {props.instructors?.map(inst => { 
        if (!props.options || props.options.length === 0 
            || (props.options.length > 0 
              && props.options.includes(props.instructors.indexOf(inst)))) {
          return (
            <MenuItem value={inst.iid} key={inst.iid}>
              {inst.name}
            </MenuItem>
          );
        } else {
          return null;
        }
      })}
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
function SemesterSelect(props) {
  const semesters = props.semesters;
  return (
    <TextField
      id="semester-select"
      select
      fullWidth
      label="Semester"
      value={props.data}
      onChange={props.update}
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
      {semesters?.map(sem => {
        if (!props.options || props.options.length === 0 
            || (props.options.length > 0
                && props.options.includes(props.semesters.indexOf(sem)))) {
          return (
            <MenuItem
              value={semesters.indexOf(sem) + 1}
              key={semesters.indexOf(sem) + 1}
            >
              {sem.semester + " " + sem.year}
            </MenuItem>
          );
        } else {
          return null;
        }
      })}
    </TextField>
  );
}

export default function CourseView(props) {
  const classes = useStyles();

  /* INPUT STATES ************************************************/
  // course object
  const [course, setCourse] = React.useState(null);
  // id of instructor currently displayed
  const [iid, setIid] = React.useState(0);
  // instructors who have taught this course previously
  const [instructors, setInstructors] = React.useState([]);
  // selectable options for instructors
  const [instOptions, setInstOptions] = React.useState([]);
  // is search anchored on instructors
  const [instAnchored, setInstAnchored] = React.useState(false);
  // semester currently displayed
  const [sem, setSem] = React.useState(0);
  // semesters in which this course was offered
  const [semesters, setSemesters] = React.useState([]);
  // selectable options for semesters
  const [semOptions, setSemOptions] = React.useState([]);
  // sections after filters are applied
  const [sections, setSections] = React.useState([]);
  // section comments
  const [comments, setComments] = React.useState([]);

  const iidChange = event => selectInstructor(Number(event.target.value));
  const semChange = event => selectSemester(Number(event.target.value));


  /* PAGE STATES *************************************************/
  const [redirect, setRedirect] = React.useState(false);
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
        for (let i = 0; i < sects.length; i++) {
          sects[i].semester = capitalizeFirstLetter(sects[i].semester);
        }
        setGPATrendData(compileGPATrend(sects.reverse()));
      })
      .catch((err) => {
        alert("Failed to fetch list of sections.");
      });
  }, [])

  /**
   * What?? I like C.
   */
  function strtok(str, delim) {
    let tokens = [];
    let head = 0;
    for (let i = 0; i < str.length; i++) {
      if (i === str.length - 1) {
        tokens.push(str.substring(head, i + 1));
      }
      if (delim.includes(str[i])) {
        if (i === head) {
          continue;
        }
        tokens.push(str.substring(head, i));
        tokens.push(str[i]);
        head = i + 1;
      }
    }
    return tokens;
  }

  function capitalizeFirstLetter(str) {
    if (str.length === 0)
      return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function setNameCapitalization(name) {
    const delims = [" ", "-", "'"];
    let tokens = strtok(name, delims);
    let ret = "";
    for (let i = 0; i < tokens.length; i++) {
      let word = tokens[i].toLowerCase();
      if (!delims.includes(tokens[i]))
        word = capitalizeFirstLetter(word);
      ret += word;
    }
    return ret;
  }

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
            name: setNameCapitalization(res.data[i][1]),
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
   * Sort semesters by REVERSE chronological order. 
   * 
   * Spring > Fall in the same year, for the present time we will assume
   * that semester is either "spring" or "fall".
   */
  function semcomp(sem1, sem2) {
    if (sem1.year != sem2.year) {
      return -(sem1.year - sem2.year);
    } else {
      if (sem1.semester === sem2.semester)
        return 0;
      else if (sem1.semester.toLowerCase() === "spring")
        return 1;
      else
        return -1;
    }
  }

  function selectInstructor(iid) {
    if (iid === 0) {
      setInstOptions([]);
      setSemOptions([]);
    }
    setInstAnchored(true);
    setIid(iid);
  }

  function selectSemester(sem) {
    if (sem === 0) {
      setSemOptions([]);
      setInstOptions([]);
    }
    setInstAnchored(false);
    setSem(sem);
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
    return uniqsems;
  }

  /**
   * Fetch list of semesters in which this course has been offered.
   */
  const loadSemesters = React.useCallback((courseId) => {
    axios.get("/coursesection/yearsemester/course/" + courseId)
      .then((res) => {
        let sems = filterSemesters(res.data);
        for (let i = 0; i < sems.length; i++) {
          sems[i].semester = capitalizeFirstLetter(sems[i].semester);
        }
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
      gpa += sects[i].avgGpa;
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
      distro[0] += sects[i].a;
      distro[1] += sects[i].ab;
      distro[2] += sects[i].b;
      distro[3] += sects[i].bc;
      distro[4] += sects[i].c;
      distro[5] += sects[i].d;
      distro[6] += sects[i].f;
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
   * Checks if a section (sect) takes place in the given semester (sem)
   */
  function sectionIsInSemester(sect, sem) {
    return (sem.year == String(sect.year) &&
            sem.semester.toLowerCase() === sect.semester.toLowerCase());
  }

  // Set selectable semester options based on list of sections
  // Instructor is anchor.
  function setSemOptsFromSects(sectOpts) {
    let opts = [];
    for (let i = 0; i < semesters.length; i++) {
      for (let j = 0; j < sectOpts.length; j++) {
        if (sectionIsInSemester(sectOpts[j], semesters[i])) {
          opts.push(i);
        }
      }
    }
    setSemOptions(opts);
  }

  // Set selectable instructor options based on list of sections
  // Semester is anchored
  function setInstOptsFromSects(sectOpts) {
    let opts = [];
    for (let i = 0; i < instructors.length; i++) {
      for (let j = 0; j < sectOpts.length; j++) {
        if (Number(instructors[i].iid) === Number(sectOpts[j].instructorId)) {
          opts.push(i);
        }
      }
    }
    setInstOptions(opts);
  }

  /**
   * Process section information retrieved from backend.
   * if filtering is anchored on instructors, then display a list of
   * semesters corresponding to the selected instructor; if anchored
   * on semester, then display a list of instructors corresponding to
   * the selected semester.
   */
  function processSections(sects) {
    sects = sects.sort(sectcomp);
    if (instAnchored && iid !== 0) {
      setSemOptsFromSects(sects);
    } else if (!instAnchored && sem !== 0) {
      setInstOptsFromSects(sects);
    }
    return sects;
  }

  /**
   * Fetch list of sections satisfying the filter parameters
   * (instructor and semester). 
   * Note that when using the sem state value to index the semesters
   * array, the value is decremented by one. See comments above 
   * SemesterSelect() for reason of doing so.
   */
  const loadSections = React.useCallback((courseId) => {
    let url = "/coursesection/section/" + courseId + "/";
    if (instAnchored && iid !== 0) {
      url += String(iid) + "/year_all/sem_all";
    } else if (!instAnchored && sem !== 0) {
      url += "inst_all/" + String(semesters[sem - 1].year)
                   + "/" + String(semesters[sem - 1].semester);
    } else {
      url += "inst_all/year_all/sem_all";
    }
    axios.get(url)
      .then((res) => {
        processSections(res.data);
      })
      .catch((err) => {
        alert("Failed to fetch list of sections.");
      });

    url = "/coursesection/section/"
    + courseId + "/"
    + (iid == 0 ? "instructor_all" : iid)
    + (sem == 0 ? "/year_all/sem_all"
      : "/" + semesters[sem - 1].year
      + "/" + semesters[sem - 1].semester);
    axios.get(url)
      .then((res) => {
        let sects = res.data.sort(sectcomp);
        for (let i = 0; i < sects.length; i++) {
          sects[i].semester = capitalizeFirstLetter(sects[i].semester);
        }
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
  }, []);

  React.useEffect(() => {
    const cid = Number(props.match.params.id);
    loadSections(cid);
    loadComments();
  }, [loadSemesters, loadSections, loadInstructors, loadCourse]);

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
    let rows = [];
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      const a = s.a ? s.a : 0;
      const ab = s.ab ? s.ab : 0;
      const b = s.b ? s.b : 0;
      const bc = s.bc ? s.bc : 0;
      const c = s.c ? s.c : 0;
      const d = s.d ? s.d : 0;
      const f = s.f ? s.f : 0;
      const entry = createData(
        sections[i].semester + " " + sections[i].year,
        sections[i].sectionMode + " " + sections[i].sectionCode,
        getInstructorName(sections[i].instructorId),
        a, ab, b, bc, c, d, f, sections[i].avgGpa);
      rows.push(entry);
    }
    return rows;
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

  return (
    <div className={classes.root}>
      { redirect ? 
        <Redirect
          to={{
            pathname: "/login",
            state: {
              redir: "/course_" + Number(props.match.params.id),
            },
          }} 
        /> : null
      }
      <div>
        <NavBar 
          atSerachPage={false} 
          logout={props.logout}
          loginStat={props.loginStat}
          user={props.user}
        />
      </div>
      <Paper className={classes.contents}>
        {course ?
          <div className={classes.unit}>
            <Typography variant="h4">
              {course.deptAbbr.toUpperCase()} {course.code}
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
              <InstructorSelect 
                data={iid}
                update={iidChange}
                instructors={instructors}
                options={instOptions}
              />
            </Grid>
            <Grid item md={6}>
              <SemesterSelect 
                data={sem}
                update={semChange}
                semesters={semesters}
                options={semOptions}
              />
            </Grid>
          </Grid>
        </div>

        <hr />
        <DataDisplay 
          compileData={compileData} 
          gradeDistData={gradeDistData}
          gpaTrendData={gpaTrendData}
          comments={comments}
          showCommentEditor={showCommentEditor}
          disableComment={disableComment}
          sections={sections}
          user={props.user}
          leaveComment={leaveComment}
          loadComments={loadComments}
        />
      </Paper>
  </div>
  );
}
