import React from 'react';
import {
  AppBar, Button, Toolbar, Typography, IconButton, Drawer, List, ListItem, Divider, Hidden
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import './topBar.css';
import axios from 'axios';
import { withRouter, RouteComponentProps } from 'react-router';
import UserList from '../userList/userList';


import { User } from '../../types';

type myProps = {
  user: User,
  users: User[],
  history: RouteComponentProps["history"],
  text: string, 
  callbackUser: (user: User | null) => void
}

type myState = {
  drawer: boolean
}


/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component<myProps, myState> {
  constructor(props) {
    super(props);
    this.state = {
      drawer: false
    };
  }

  handleLogout = (e) => {
    e.preventDefault();
    axios.post('/admin/logout')
      .then(() => {
        this.props.callbackUser(null);
        this.props.history.push('/login');
      })
      .catch(err => console.log(err.response));
  };


  handleAddPhoto = (e) => {
    e.preventDefault();
    this.props.history.push('/photos/add');
  };


  handleClick = e => {
    e.preventDefault();
    this.props.history.push('/activities');
  };


  displayMobile = () => {
    return (
      <>
        {this.props.user &&
          (
            <IconButton edge="start" color="inherit" onClick={() => this.setState({ drawer: true })}>
              <MenuIcon />
            </IconButton>
          )}
        <Drawer open={this.state.drawer} anchor='left' onClose={() => this.setState({ drawer: false })}>
          <List>
            {this.props.user &&
              (
                <>
                  <ListItem>
                    <Typography variant="h5" color="inherit">
                    {`Hi ${this.props.user.first_name} ${this.props.user.last_name}`}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Button variant="contained" color="secondary" onClick={this.handleAddPhoto}>
                      Add photo
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button color="inherit" onClick={this.handleClick}>
                      Latest activities
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button color="inherit" onClick={this.handleLogout}>
                      Logout
                    </Button>
                  </ListItem>
                  <Divider />
                </>
              )}
            <UserList users={this.props.users} />
          </List>
        </Drawer>
        <Typography variant="h6" color="inherit" className="topbar-right topbar-text">
          {this.props.user ? this.props.text : "Please login"}
        </Typography>
      </>
    );
  };

  displayDesktop = () => {
    return (
      <>
        {this.props.user ?
          (
            <>
              <Typography variant="h5" color="inherit">
                {`Hi ${this.props.user.first_name} ${this.props.user.last_name}`}
              </Typography>
              <Button variant="contained" color="secondary" onClick={this.handleAddPhoto} className="add-photo-button">
                Add photo
              </Button>
              <Button color="inherit" onClick={this.handleClick}>
                Latest activities
              </Button>
              <Button color="inherit" onClick={this.handleLogout}>
                Logout
              </Button>
            </>
          ) : null}
        <Typography variant="h6" color="inherit" className="topbar-right topbar-text">
          {this.props.user ? this.props.text : "Please login"}
        </Typography>
      </>
    );
  };


  render() {
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
          <Hidden mdUp>
            {this.displayMobile()}
          </Hidden>
          <Hidden only={['xs', 'sm']} >
            {this.displayDesktop()}
          </Hidden>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(TopBar);
