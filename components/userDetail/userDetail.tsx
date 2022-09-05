import React from 'react';
import {
  Typography,
  Divider,
  Grid,
  AppBar,
  Tabs,
  Tab
} from '@material-ui/core';
import './userDetail.css';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { User } from '../../types';

interface MatchParams {
  userId: string;
}

type myProps = {
  callback: (text: string) => void,
  history: RouteComponentProps["history"],
  match: RouteComponentProps<MatchParams>["match"],
  tabsValue: number
}

type myState = {
  userDetails: User | null
}


/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component<myProps, myState> {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: null
    };
  }

  componentDidMount() {
    const userId = this.props.match.params.userId;
    const path = this.props.match.path;

    console.log(this.props);

    axios.get('user/' + userId)
      .then(res => { 
        this.setState({ userDetails: res.data }); 
        let prefix: string;
        if (path.slice(0,6) === "/users") { prefix = "Photos of ";}
        if (path.slice(0,9) === "/mentions") { prefix = "Mentions of ";}
        this.props.callback(prefix + res.data.first_name + " " + res.data.last_name); 
      })
      .catch(err => console.log(err.response));
  }

  componentDidUpdate(prevProps: myProps) {
    if (this.props.match.url === prevProps.match.url) {
      return;
    }

    const userId = this.props.match.params.userId;
    const path = this.props.match.path;

    axios.get('user/' + userId)
      .then(res => { 
        this.setState({ userDetails: res.data }); 
        let prefix: string;
        if (path.slice(0,6) === "/users") { prefix = "Photos of ";}
        if (path.slice(0,9) === "/mentions") { prefix = "Mentions of ";}
        this.props.callback(prefix + res.data.first_name + " " + res.data.last_name); 
      })
      .catch(err => console.log(err.response));
  }

  handleChange = (event, newValue : number) => {
    let url : string;
    if (newValue === 0) { url = "/users/" + this.state.userDetails._id; }
    if (newValue === 1) { url = "/mentions/" + this.state.userDetails._id; }
    this.props.history.push(url);
  };

  render() {
    const userDetails = this.state.userDetails;
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
          <Typography variant="body1" className="description">
            {userDetails.description}
          </Typography>
          <Grid container className="user-info-container">
            <Grid item>
              <Typography variant="body2" className="location">
                <b>Location: </b> {userDetails.location}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                <b>Occupation: </b> {userDetails.occupation}
              </Typography>
            </Grid>
          </Grid>
          <Divider />
          <AppBar position="static" className="navigation-bar">
            <Tabs value={this.props.tabsValue} textColor="primary" onChange={this.handleChange} indicatorColor="primary">
              <Tab label="Photos" />
              <Tab label="Mentions" />
            </Tabs>
          </AppBar>
        </div>
      </div>
    );
  }
}

export default UserDetail;
