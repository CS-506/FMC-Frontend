import React from "react";
import axios from "axios";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Typography, 
  Paper,
} from "@material-ui/core";
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  unit: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

export default function CommentSection(props) {
  const classes = useStyles();
  const [rc, setRC] = React.useState();

  React.useEffect(() => {
    setRC(props.rc);
  }, [setRC]);
  
  return (
    <Link 
      to={{ pathname: 'course_' }}
      
      style={{ textDecoration: 'none' }}
    >
      <Paper
        className={classes.paper} 
        style={{ padding:10, paddingLeft:20}}
        md={3}
      >
        <Typography variant="subtitle1">
            {rc.subject} {rc.code}<br/> 
            {rc.name} 
        </Typography>
        <Typography>
          Rating: {rc.rate} <br/> 
          Comment: {rc.comment}
        </Typography>
      </Paper>
    </Link>
  );
}