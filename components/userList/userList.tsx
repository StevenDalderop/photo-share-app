import React from 'react';
import { Link } from 'react-router-dom';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography
}
  from '@material-ui/core';
import './userList.css';
import { User } from '../../types';


/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component<{ users: User[] }> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <List component="nav">
          <ListItem>
            <Typography variant="h5" color="inherit">
              Friends
            </Typography>
          </ListItem>
          {
            this.props.users.map(user => {
              return (
                <div key={user._id}>
                  <ListItem component={Link} to={"/users/" + user._id}>
                    <Typography variant="body1" className="friend">
                      {user.first_name + " " + user.last_name}
                    </Typography> 
                  </ListItem>
                  <Divider />
                </div>
              );
            })
          }
        </List>
      </div>
    );
  }
}

export default UserList;
