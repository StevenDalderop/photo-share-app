import React from 'react';
import './photo.css';
import { Link } from 'react-router-dom';
import { Typography, List, Divider, Grid } from '@material-ui/core';
import axios from 'axios';
import { ThumbUp, ThumbUpOutlined } from '@material-ui/icons';
import CommentForm from '../commentForm/commentForm';

import { Photo as PhotoType, User, Comment } from '../../types';


const renderMention = (text: string, userId: string) => {
  return (
    <Typography component={Link} to={"/users/" + userId} variant="subtitle2" display="inline" className="mention">
      {text}
    </Typography>
  );
};

const renderText = (text: string) => {
  return (
    <Typography variant="body1" display="inline">
      {text}
    </Typography>
  );
};

const renderHighlightedComment = (comment: Comment) => {
  if (comment.mentions.length === 0) {
    return (
      <>
        {renderText(comment.comment)}
      </>
    );
  }

  const components: React.ReactNode[] = [];
  let index = 0;

  for (const mention of comment.mentions) {
    const text = comment.comment.slice(index, mention.plainTextIndex);
    components.push(renderText(text));

    index = mention.plainTextIndex + mention.display.length;
    const mentionText = comment.comment.slice(mention.plainTextIndex, index);
    components.push(renderMention(mentionText, mention.id));
  }

  components.push(renderText(comment.comment.slice(index)));

  return (<div> {components} </div>);
};

const renderComment = (comment: Comment) => {
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
      {renderHighlightedComment(comment)}
      <Divider />
    </div>
  );
};


type myProps = {
  img: PhotoType,
  reloadPhotos: () => void,
  callbackLikes: (photo: PhotoType) => void,
  user: User | null,
  users: User[]
}


class Photo extends React.Component<myProps> {
  constructor(props) {
    super(props);
  }

  handleLike = (image: PhotoType) => {
    let liked = false;
    if (this.props.user !== null) {
      liked = this.props.img.likes.includes(this.props.user._id);
    }

    axios.put('photo/' + image._id, { like: !liked })
      .then((res) => this.props.callbackLikes(res.data))
      .catch(err => console.log(err.response));
  };

  render() {
    const img = this.props.img;

    let liked = false;
    if (this.props.user !== null) {
      liked = this.props.img.likes.includes(this.props.user._id);
    }

    return (
      <Grid key={img._id} item sm={7} md={5}>
        <img id={img._id} className="photo" src={"../images/" + img.file_name} />
        <Grid container justifyContent='space-between' alignItems='flex-end'>
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
              <Typography variant="caption" className="likes-count">
                {img.likes.length}
              </Typography>
            </div>
          </Grid>
        </Grid>
        <List>
          <Divider />
          {img.comments ? img.comments.map(renderComment) : null}
          <CommentForm users={this.props.users} img={img} reloadPhotos={this.props.reloadPhotos} />
        </List>
      </Grid>
    );
  }
}

export default Photo;
