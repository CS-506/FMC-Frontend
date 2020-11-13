import React from "react";
import axios from "axios";
import {
  Typography, Grid, TextField, Button,
} from "@material-ui/core/";

export default function CommentEditor(props) {
  const [commentText, setCommentText] = React.useState("");
  const commentUpdate = event => setCommentText(event.target.value);

  function submitComment() {
    const comment = {
      sectionId: props.sectionId,
      userId: props.userId,
      comment: commentText,
    };
    console.log(comment);
    axios.post("/user/scomment/add", comment)
      .then((res) => {
        setCommentText("");
        props.disable();
      })
      .catch((err) => {
        alert("Failed to post comment.");
      })
  }

  return (
    <div>
      <Typography variant="h6"> Create a new comment
      </Typography>

      <Grid container spacing={2}>
        <Grid item md={12}>
          <TextField
            id="new-comment-text-field"
            label="New Comment"
            multiline
            autoFocus
            fullWidth
            rows={3}
            key="comment-editor-textfield"
            value={commentText}
            onChange={commentUpdate}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={submitComment}
          >
            Submit
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={() => props.disable(false)}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
