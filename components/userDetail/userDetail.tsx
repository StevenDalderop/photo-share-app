import React from 'react';
import {
  Typography,
  Divider,
  Button,
  Grid
} from '@material-ui/core';
import './userDetail.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Tumbnail from '../tumbnail/tumbnail';
import { user, photo } from '../../types';

type myProps = {
  callback: (text: string) => void,
  history: any,
  match: any
}

type myState = {
  userDetails: user | null,
  mentionedPhotos: photo[]
}


/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component<myProps, myState> {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: null,
      mentionedPhotos: []
    };
  }

  componentDidMount() {
    let userId = this.props.match.params.userId;
    axios.get('user/' + userId)
      .then(res => { this.setState({ userDetails: res.data }); this.props.callback(res.data.first_name + " " + res.data.last_name); })
      .catch(err => console.log(err.response));

    axios.get('mentionedPhotos/' + userId)
      .then(res => this.setState({ mentionedPhotos: res.data }))
      .catch(err => console.log(err.response));
  }

  componentDidUpdate(prevProps : myProps) {
    if (this.props.match.params.userId === prevProps.match.params.userId) {
      return;
    };

    let userId = this.props.match.params.userId;
    axios.get('user/' + userId)
      .then(res => { this.setState({ userDetails: res.data }); this.props.callback(res.data.first_name + " " + res.data.last_name); })
      .catch(err => console.log(err.response));

    axios.get('mentionedPhotos/' + userId)
      .then(res => this.setState({ mentionedPhotos: res.data }))
      .catch(err => console.log(err.response));
  }

  render() {
    let userDetails = this.state.userDetails;
    if (userDetails === null) {
      return (
        <div></div>
      );
    }

    return (
      <div>
        <div>
          <Typography variant="h3">
            {userDetails.first_name + " " + userDetails.last_name}
          </Typography>
          <Typography variant="subtitle1">
            {"Location: " + userDetails.location}
          </Typography>
          <Typography variant="subtitle1">
            {"Occupation: " + userDetails.occupation}
          </Typography>
          <Divider />
          <Typography variant="body2" className="description">
            {userDetails.description}
          </Typography>
          <Button variant="contained" color="primary" component={Link} to={"/photos/" + userDetails._id} className="photo-button">
            Show photos
          </Button>
          <Typography variant="h4">
            Mentions
          </Typography>
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
      </div>
    );
  }
}

export default UserDetail;
