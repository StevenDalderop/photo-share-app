import React from "react";
import {
  Button,
  Grid
} from '@material-ui/core';
import { MentionsInput, Mention } from 'react-mentions';
import axios from "axios";

import './commentForm.css';
import { photo, user } from '../../types';

type myProps = {
  img: photo,
  users: user[],
  reloadPhotos: () => void
}

type myState = {
  comment: string,
  mentions: any[]
}


class CommentForm extends React.Component<myProps, myState> {
  constructor(props) {
    super(props);
    this.state = {
      comment: "",
      mentions: []
    };
  }

  handleChange = (e, newValue, newPlainTextValue, mentions) => {
    this.setState({ comment: newPlainTextValue, mentions: mentions });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/commentsOfPhoto/' + this.props.img._id, { comment: this.state.comment })
      .then(() => {
        this.setState({ comment: "" });

        axios.post('mentionsOfPhoto/' + this.props.img._id, { mentions: this.state.mentions })
          .then(() => {
            this.setState({ mentions: [] });

            this.props.reloadPhotos();
          })
          .catch(err => console.log(err.response));
      })
      .catch(err => console.log(err.response));
  };


  render() {
    console.log(this.state.comment);
    console.log(this.state.mentions);
    return (
      <form className="comment-form" noValidate autoComplete="off" onSubmit={(e) => this.handleSubmit(e)}>
        <div id="suggestions"></div>
        <Grid container alignItems="flex-end" spacing={3}>
          <Grid item xs className="mentions-container">
            <MentionsInput className="mentions" name="comment" placeholder="Add a comment" suggestionsPortalHost={document.getElementById("suggestions")} value={this.state.comment} onChange={this.handleChange}>
              <Mention
                trigger="@"
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