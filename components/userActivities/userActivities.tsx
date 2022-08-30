import axios from "axios";
import React from "react";
import {
  Button,
  Grid,
  Typography
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import Tumbnail from "../tumbnail/tumbnail";
import { activity } from "../../types";


class UserActivities extends React.Component<{ callback: (text: string) => void }, { activities: activity[] }> {
  constructor(props) {
    super(props);
    this.state = {
      activities: []
    };
  }

  componentDidMount() {
    axios.get('/activities')
      .then(res => this.setState({ activities: res.data }))
      .catch(err => console.log(err.response));

    this.props.callback("Latest activities");
  }

  handleClick = () => {
    axios.get('/activities')
      .then(res => this.setState({ activities: res.data }))
      .catch(err => console.log(err.response));
  };

  renderActivity(activity: activity) {
    return (
      <Grid key={activity._id} item xs={12}>
        <Typography variant="h5">
          {activity.type}
        </Typography>
        <Typography variant="body2" component={Link} to={"/users/" + activity.user._id}>
          {`${activity.user.first_name} ${activity.user.last_name}`}
        </Typography>
        <Typography variant="body2">
          {new Date(activity.date_time).toLocaleString()}
        </Typography>
        {activity.photo ? <Tumbnail {...this.props} img={activity.photo} /> : null}
      </Grid>
    );
  }

  render() {
    return (
      <div>
        <Button variant="contained" color="primary" onClick={this.handleClick}>
          Refresh
        </Button>
        {this.state.activities.length > 0 ?
          (
            <Grid alignItems={'center'} container spacing={4}>
              {this.state.activities.map(activity => this.renderActivity(activity))}
            </Grid>
          ) :
          null}
      </div>
    );
  }
}

export default UserActivities;