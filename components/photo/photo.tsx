import React from 'react';
import './photo.css';
import { Link } from 'react-router-dom';
import { Typography, List, Divider, Grid } from '@material-ui/core';
import axios from 'axios';
import { ThumbUp, ThumbUpOutlined } from '@material-ui/icons';
import CommentForm from '../commentForm/CommentForm';

import { photo, user } from '../../types';

type myProps = {
  img: photo,
  reloadPhotos: () => void,
  callbackLikes: (photo: photo) => void,
  user: user | null,
  users: user[]
}


class Photo extends React.Component<myProps> {
  constructor(props) {
    super(props);
  }

  handleLike = image => {
    let liked = false;
    if (this.props.user !== null) {
      liked = this.props.img.likes.includes(this.props.user._id);
    }

    axios.put('photo/' + image._id, { like: !liked })
      .then((res) => this.props.callbackLikes(res.data))
      .catch(err => console.log(err.response));
  };


  renderComment(comment) {
    return (
      <div key={comment._id} className="comment">
        <div className="comment-header">
          <Typography variant="body1" className="comment-date-time">
            {new Date(comment.date_time).toLocaleString()}
          </Typography>
          <Typography component={Link} to={"/users/" + comment.user._id} variant="body1" className="comment-date-time">
            {comment.user.first_name + " " + comment.user.last_name}
          </Typography>
        </div>
        <Typography variant="body2">
          {comment.comment}
        </Typography>
        <Divider />
      </div>
    );
  }




  render() {
    let img = this.props.img;
    
    let liked = false;
    if (this.props.user !== null) {
      liked = this.props.img.likes.includes(this.props.user._id);
    }

    return (
      <Grid key={img._id} item sm={7} md={5}>
        <img id={img._id} className="photo" src={"../images/" + img.file_name} />
        <Grid container justifyContent='space-between'>
          <Grid item sm={6}>
            <Typography variant="caption">
              {new Date(img.date_time).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item sm={2}>
            <div className="likes">
              {liked ?
                <ThumbUp color="primary" onClick={() => this.handleLike(img)} /> :
                <ThumbUpOutlined color="primary" onClick={() => this.handleLike(img)} />}
              <Typography variant="caption">
                {img.likes.length}
              </Typography>
            </div>
          </Grid>
        </Grid>
        <List>
          <Divider />
          {img.comments ? img.comments.map(this.renderComment) : null}
          <CommentForm users={this.props.users} img={img} reloadPhotos={this.props.reloadPhotos} />
        </List>
      </Grid>
    );
  }
}

export default Photo;
