import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch
} from 'react-router-dom';
import {
  Grid, Paper, Hidden, Typography
} from '@material-ui/core';
import './styles/main.css';
import axios
  from 'axios';
// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';
import LoginRegister from './components/loginRegister/loginRegister';
import AddPhoto from './components/addPhoto/addPhoto';
import Activities from './components/userActivities/userActivities';
import PrivateRoute from './components/privateRoute/privateRoute';

import { user } from './types';

type myState = {
  text: string,
  user: user | null,
  users: user[]
}


class PhotoShare extends React.Component<any, myState> {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      user: null,
      users: []
    };
  }

  callback = (value: string) => {
    this.setState({ text: value });
  };

  callbackUser = (user: user) => {
    this.setState({ user: user });
  };

  componentDidMount() {
    if (this.state.user === null) {
      return;
    }

    axios.get('/user/list')
      .then(res => this.setState({ users: res.data }))
      .catch(err => console.log(err.response));
  }

  componentDidUpdate(prevProps, prevState: myState) {
    if (this.state.user === null) {
      return;
    }

    if (prevState.user === null || prevState.user._id !== this.state.user._id) {
      axios.get('/user/list')
        .then(res => this.setState({ users: res.data }))
        .catch(err => console.log(err));
    }
  }

  render() {
    const logged_in = this.state.user !== null;

    return (
      <HashRouter>
        <div className="main-container">
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TopBar user={this.state.user} text={this.state.text} users={this.state.users} callbackUser={this.callbackUser} />
            </Grid>
            <div className="cs142-main-topbar-buffer" />
            <Hidden only={['xs', 'sm']}>
              <Grid item md={3}>
                <Paper className="cs142-main-grid-item">
                  {logged_in ? <UserList users={this.state.users} /> : null}
                </Paper>
              </Grid>
            </Hidden>
            <Grid item xs={12} md={9}>
              <Paper className="cs142-main-grid-item">
                <Switch>
                  <Route path="/login"
                    render={props => <LoginRegister history={props.history} callback={this.callback} callbackUser={this.callbackUser} />}
                  />
                  <PrivateRoute path="/activities" logged_in={logged_in}>
                    <Activities callback={this.callback} />
                  </PrivateRoute>
                  <PrivateRoute path="/users/:userId" logged_in={logged_in}>
                    <UserDetail callback={this.callback} />
                  </PrivateRoute>
                  <PrivateRoute path="/photos/add" logged_in={logged_in}>
                    <AddPhoto callback={this.callback} />
                  </PrivateRoute>
                  <PrivateRoute path="/photos/:userId" logged_in={logged_in}>
                    <UserPhotos user={this.state.user} users={this.state.users} callback={this.callback} />
                  </PrivateRoute>
                  <PrivateRoute path="*" logged_in={logged_in}>
                    <Typography variant="body1">Page does not exist</Typography>
                  </PrivateRoute>
                </Switch>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </HashRouter>
    );
  }
}


ReactDOM.render(
  <PhotoShare />,
  document.getElementById('photoshareapp'),
);
