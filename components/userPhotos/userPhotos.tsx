import React from 'react';
import { RouteComponentProps } from 'react-router';
import axios from 'axios';
import {
  Grid
} from '@material-ui/core';
import './userPhotos.css';

import Photo from '../photo/photo';
import { Photo as  PhotoType, User } from '../../types';


type myProps = {
  match: any,
  location: RouteComponentProps["location"],
  callback: (text: string) => void,
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
      .then(res => {this.setState({photos: res.data}); this.scroll();})
      .catch(err => console.log(err));

    axios.get('/user/' + userId)
      .then(res => {
        const text = 'Photos of ' + res.data.first_name + ' ' + res.data.last_name;
        this.props.callback(text);
      })
      .catch(err => console.log(err));
  }

  callback = () => {
    const userId = this.props.match.params.userId;
    axios.get('/photosofuser/' + userId)
      .then(res => {this.setState({photos: res.data});})
      .catch(err => console.log(err));
  };


  callbackLikes = (updatedPhoto : PhotoType) => {
    this.setState(prevState => {
      const index = prevState.photos.findIndex(photo => photo._id === updatedPhoto._id);
      const photos = [...this.state.photos];
      photos[index] = updatedPhoto;
      return {photos: photos};
    });
  };

  reloadPhotos = () => {
    const userId = this.props.match.params.userId;

    axios.get('/photosofuser/' + userId)
      .then(res => {this.setState({photos: res.data}); this.scroll();})
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
      <Grid container spacing={3} direction='column' alignItems='center'>
        { this.state.photos ? this.state.photos.map(img => (
          <Photo key={img._id} 
            user={this.props.user} 
            users={this.props.users} 
            img={img} 
            callbackLikes={this.callbackLikes}
            reloadPhotos={this.reloadPhotos} />
          )) : null }
      </Grid>
    );
  }
}

export default UserPhotos;
