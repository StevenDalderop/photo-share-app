import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch, Redirect
} from 'react-router-dom';
import {
  Grid, Paper, Hidden, Typography
} from '@material-ui/core';
import './styles/main.css';
import axios
  from 'axios';
// import necessary components
import TopBar from './components/topBar/topBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserMentions from './components/userMentions/userMentions';
import UserPhotos from './components/userPhotos/userPhotos';
import LoginRegister from './components/loginRegister/loginRegister';
import AddPhoto from './components/addPhoto/addPhoto';
import Activities from './components/userActivities/userActivities';

import { User } from './types';

type myState = {
  text: string,
  user: User | null,
  users: User[]
}

const PrivateRoutes = function (props: { logged_in: boolean, callback: (value: string) => void, user: User | null, users: User[] }) {
  if (!props.logged_in) {
    return <Redirect to="/login" />;
  }

  return (
    <Switch>
      <Route path="/activities" render={props_ => {
        return <Activities callback={props.callback} history={props_.history} />;
      }} />
      <Route path="/users/:userId" render={props_ => {
        return (
          <>
            <UserDetail callback={props.callback} history={props_.history} match={props_.match} tabsValue={0} />
            <UserPhotos match={props_.match} location={props_.location} user={props.user} users={props.users} />
          </>
        );
      }}>
      </Route>
      <Route path="/mentions/:userId" render={props_ => {
        return (
          <>
            <UserDetail callback={props.callback} history={props_.history} match={props_.match} tabsValue={1} />
            <UserMentions match={props_.match} history={props_.history} />
          </>
        );
      }} />
      <Route path="/photos/add">
        <AddPhoto callback={props.callback} />
      </Route>
      <Route path="*">
        <Typography variant="body1">Page does not exist</Typography>
      </Route>
    </Switch>
  );
};

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

  callbackUser = (user: User) => {
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
        .catch(err => console.log(err.response));
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
                  <Route>
                    <PrivateRoutes logged_in={logged_in} callback={this.callback} user={this.state.user} users={this.state.users} />
                  </Route>
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
