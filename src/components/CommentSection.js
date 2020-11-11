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

  return (
    <Typography className={classes.unit} variant="h5">
      Comments
    </Typography>
  );
}