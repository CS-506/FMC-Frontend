import React from "react";
import axios from "axios";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Typography, Paper, IconButton,
} from "@material-ui/core";
import {
  DeleteForeverOutlined as DeleteIcon,
} from "@material-ui/icons";
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  unit: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  comment_card: {
    flexGrow: 1,
    padding: 10,
    paddingLeft: 20,
  },
}));


export default function CommentCard(props) {
  const classes = useStyles();

  function deleteComment(scid) {
    axios.delete("/user/scomment/delete/id/" + scid)
    .then((res) => {
      props.reload();
    })
    .catch((err) => {
      alert("Failed to delete comment.");
    });
  }

  console.log(props);
  
  return (
    <Paper className={classes.comment_card} md={3}>
      <Typography variant="subtitle2">
        {props.comment.time.split("T")[0]} #{props.comment.sectionId}
        {props.byUser ? " by you" : ""}
        <br />
      </Typography>
      <hr/>
      <Typography variant="body2">
        {props.comment.comment}
      </Typography>
      {
        props.byUser ? (
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              deleteComment(props.comment.scommentId)
            }}
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        ) : null
      }
      <br />
    </Paper>
  );
}
