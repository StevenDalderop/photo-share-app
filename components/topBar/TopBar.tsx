import React from 'react';
import {
  AppBar, Button, Toolbar, Typography, IconButton, Drawer, List, ListItem, Divider, Hidden
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import './TopBar.css';
import axios from 'axios';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import UserList from '../userList/userList';


import { user } from '../../types';

type myProps = {
  user: user,
  users: user[],
  history: any,
  text: string, 
  callbackUser: (user: user | null) => void
}

type myState = {
  version: string,
  drawer: boolean
}


/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component<myProps, myState> {
  constructor(props) {
    super(props);
    this.state = {
      version: "",
      drawer: false
    };
  }


  componentDidMount() {
    if (this.props.user === null) {
      return;
    }

    axios.get('/test/info')
      .then((res) => this.setState({
        version: res.data.__v
      }))
      .catch(err => console.log(err));
  }


  componentDidUpdate(prevProps) {
    if (this.props.user === null) {
      return;
    }

    if (prevProps.user === null || prevProps.user._id !== this.props.user._id) {
      axios.get('/test/info')
        .then((res) => this.setState({
          version: res.data.__v
        }))
        .catch(err => console.log(err));
    }
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
                      {"Hi " + this.props.user.first_name}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Button color="inherit" onClick={this.handleLogout}>
                      Logout
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button color="inherit" onClick={this.handleAddPhoto}>
                      Add photo
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button color="inherit" onClick={this.handleClick}>
                      Activities
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Typography className="version" variant="subtitle2" color="inherit">
                      {"Version: " + this.state.version}
                    </Typography>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <Typography variant="h5" color="inherit">
                      Friends
                    </Typography>
                  </ListItem>
                </>
              )}
            <UserList users={this.props.users} />
          </List>
        </Drawer>
        <Typography variant="h5" color="inherit" className="topbar-right">
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
                {"Hi " + this.props.user.first_name}
              </Typography>
              <Button className="logout-button" color="inherit" onClick={this.handleLogout}>
                Logout
              </Button>
              <Button color="inherit" onClick={this.handleAddPhoto}>
                Add photo
              </Button>
              <Button color="inherit" onClick={this.handleClick}>
                Activities
              </Button>
              <Typography className="version" variant="subtitle2" color="inherit">
                {"Version: " + this.state.version}
              </Typography>
            </>
          ) : null}
        <Typography variant="h5" color="inherit" className="topbar-right">
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
