import React from "react";
import { RouteComponentProps } from 'react-router-dom';
import { Typography, Grid } from "@material-ui/core";
import axios from 'axios';

import Tumbnail from '../tumbnail/tumbnail';
import './userMentions.css';
import { Photo } from "../../types";

interface MatchParams {
  userId: string;
}

type MyProps = {
  match: RouteComponentProps<MatchParams>["match"],
  history: RouteComponentProps["history"]
}

type MyState = {
  mentionedPhotos: Photo[]
}


class UserMentions extends React.Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);
    this.state = {
      mentionedPhotos: []
    };
  }

  componentDidMount(): void {
    const userId = this.props.match.params.userId;

    axios.get('mentionedPhotos/' + userId)
      .then(res => this.setState({ mentionedPhotos: res.data }))
      .catch(err => console.log(err.response));
  }

  componentDidUpdate(prevProps: Readonly<MyProps>): void {
    const userId = this.props.match.params.userId;

    if (userId === prevProps.match.params.userId) { return; }

    axios.get('mentionedPhotos/' + userId)
      .then(res => this.setState({ mentionedPhotos: res.data }))
      .catch(err => console.log(err.response));
  }

  render() {
    return (
      <div>
        {
          this.state.mentionedPhotos.length > 0 ?
            (
              <Grid container spacing={3}>
                {
                  this.state.mentionedPhotos.map(photo => {
                    return (
                      <Grid key={photo._id} item sm={4} md={3}>
                        <Tumbnail history={this.props.history} img={photo} />
                      </Grid>
                    );
                  })
                }
              </Grid>
            ) :
            (
              <Typography variant="body2" className="description">
                Currently not mentioned in photos.
              </Typography>
            )
        }
      </div>
    );
  }
}

export default UserMentions;