import React from "react";
import {
  Button,
  Grid
} from '@material-ui/core';
import { MentionsInput, Mention } from 'react-mentions';
import axios from "axios";

import './commentForm.css';
import { photo, user, mention, comment } from '../../types';

type myProps = {
  img: photo,
  users: user[],
  reloadPhotos: () => void
}

type myState = {
  comment: string,
  plainComment: string,
  mentions: mention[]
}


class CommentForm extends React.Component<myProps, myState> {
  constructor(props) {
    super(props);
    this.state = {
      plainComment: "",
      comment: "",
      mentions: []
    };
  }

  handleChange = (e : React.SyntheticEvent, newValue: string, newPlainTextValue: string, mentions: mention[]) => {
    this.setState({ plainComment: newPlainTextValue, comment: newValue, mentions: mentions });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let comment = { comment: this.state.plainComment, mentions: this.state.mentions, comment_markup: this.state.comment };

    axios.post('/commentsOfPhoto/' + this.props.img._id, comment)
      .then(() => {
        this.setState({ plainComment: "", comment: "" });
      })
      .catch(err => console.log(err.response));

    axios.post('mentionsOfPhoto/' + this.props.img._id, { mentions: this.state.mentions })
      .then(() => {
        this.setState({ mentions: [] });
        this.props.reloadPhotos();
      })
      .catch(err => console.log(err.response));
  };


  render() {
    console.log(this.state);
    return (
      <form className="comment-form" noValidate autoComplete="off" onSubmit={(e) => this.handleSubmit(e)}>
        <div id="suggestions"></div>
        <Grid container alignItems="flex-end" spacing={3}>
          <Grid item xs className="mentions-container">
            <MentionsInput className="mentions" name="comment" placeholder="Add a comment"
              suggestionsPortalHost={document.getElementById("suggestions")}
              value={this.state.comment} onChange={this.handleChange}>
              <Mention
                trigger="@"
                className="mentions__mention"
                data={this.props.users.map(function (user) {
                  return { id: user._id, display: "@" + user.first_name + " " + user.last_name };
                })}
              />
            </MentionsInput>
          </Grid>
          <Grid item xs={"auto"}>
            <Button className="add-comment-button" variant="contained" color="primary" size="small" type="submit">
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  }
}

export default CommentForm;