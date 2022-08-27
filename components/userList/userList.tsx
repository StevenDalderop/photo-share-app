import React from 'react';
import { Link } from 'react-router-dom';
import {
  Divider,
  List,
  ListItem,
  ListItemText
}
  from '@material-ui/core';
import './userList.css';
import { user } from '../../types';


/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component<{users: user[]}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <List component="nav">
          {
            this.props.users.map(user => {
              return (
                <div key={user._id}>
                  <ListItem component={Link} to={"/users/" + user._id}>
                    <ListItemText primary={user.first_name + " " + user.last_name} />
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
