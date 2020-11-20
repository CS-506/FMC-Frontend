import React from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography, Paper, IconButton,
} from "@material-ui/core";
import {
  DeleteForeverOutlined as DeleteIcon,
} from "@material-ui/icons";

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

  return (
    <Paper className={classes.comment_card} md={3}>
      <Typography variant="subtitle1">
        { (props.courseId) ? 
          props.courseId + " " : ""
        }
        { (props.courseName) ? 
          props.courseName : ""
        }
      </Typography>
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
            style={{
              float: "right",
            }}
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
