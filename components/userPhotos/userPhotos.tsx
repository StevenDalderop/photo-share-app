import React from 'react';
import { RouteComponentProps } from 'react-router';
import axios from 'axios';
import {
  Grid, Typography
} from '@material-ui/core';
import './userPhotos.css';

import Photo from '../photo/photo';
import { Photo as PhotoType, User } from '../../types';

interface MatchParams {
  userId: string
}

type myProps = {
  match: RouteComponentProps<MatchParams>["match"],
  location: RouteComponentProps["location"],
  user: User | null,
  users: User[]
}

type myState = {
  photos: PhotoType[]
}

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component<myProps, myState> {
  constructor(props) {
    super(props);
    this.state = {
      photos: []
    };
  }

  componentDidMount() {
    const userId = this.props.match.params.userId;

    axios.get('/photosofuser/' + userId)
      .then(res => { this.setState({ photos: res.data }); this.scroll(); })
      .catch(err => console.log(err));
  }

  componentDidUpdate(prevProps: Readonly<myProps>): void {
    const userId = this.props.match.params.userId;

    if (userId === prevProps.match.params.userId) {
      return;
    }

    axios.get('/photosofuser/' + userId)
      .then(res => { this.setState({ photos: res.data }); this.scroll(); })
      .catch(err => console.log(err));
  }


  callbackLikes = (updatedPhoto: PhotoType) => {
    this.setState(prevState => {
      const index = prevState.photos.findIndex(photo => photo._id === updatedPhoto._id);
      const photos = [...this.state.photos];
      photos[index] = updatedPhoto;
      return { photos: photos };
    });
  };

  reloadPhotos = () => {
    const userId = this.props.match.params.userId;

    axios.get('/photosofuser/' + userId)
      .then(res => { this.setState({ photos: res.data }); this.scroll(); })
      .catch(err => console.log(err.response));
  };


  scroll() {
    const id = this.props.location.hash;
    if (!id) {
      return;
    }
    const element = document.getElementById(id.slice(1));
    if (element) {
      element.scrollIntoView();
    }
  }


  render() {
    return (
      <div>
        {
          this.state.photos.length > 0 ?
            (
              <Grid container spacing={3} direction='column'>
                {
                  this.state.photos.map(img => (
                    <Photo key={img._id}
                      user={this.props.user}
                      users={this.props.users}
                      img={img}
                      callbackLikes={this.callbackLikes}
                      reloadPhotos={this.reloadPhotos} />
                  ))
                }
              </Grid>
            ) :
            (
              <Typography variant="body2" className="description">
                Currently not any photos uploaded.
              </Typography>
            )
        }
      </div>
    );
  }
}

export default UserPhotos;
