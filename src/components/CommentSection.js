import React from "react";
import axios from "axios";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  unit: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

export default function CommentSection(props) {
  const classes = useStyles();
  const [RC, setRC] = React.useState();

  React.useEffect(() => {
    setRC(props.rc);
  }, [setRC]);
  
  return (
    <Link 
      to={{ pathname: 'course_' }}
      
      style={{ textDecoration: 'none' }}
      key={user.RC.indexOf(rcItem)}
    >
      <Paper
        className={classes.paper} 
        style={{ padding:10, paddingLeft:20}}
        md={3}
      >
        <Typography variant="subtitle1">
            {rcItem.subject} {rcItem.code}<br/> 
            {rcItem.name} 
        </Typography>
        <Typography>
          Rating: {rcItem.rate} <br/> 
          Comment: {rcItem.comment}
        </Typography>
      </Paper>
    </Link>
  );
}