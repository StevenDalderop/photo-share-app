import React from 'react';
import './tumbnail.css';

import {
    Typography
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { photo } from '../../types';


type myProps = {
    history: any, 
    img: photo
}


class Tumbnail extends React.Component<myProps> {
    constructor(props) {
        super(props);
    }

    handleClick = image => {
        this.props.history.push('/photos/' + image.user_id._id + "#" + image._id);
    };

    render() {
        return (
            <div className='tumbnail-container'>
                <Typography className="name" component={Link} to={"/users/" + this.props.img.user_id._id} variant="body2">
                    {`Photo by ${this.props.img.user_id.first_name} ${this.props.img.user_id.last_name}`}
                </Typography>
                <img className="tumbnail" src={"../images/" + this.props.img.file_name} onClick={() => this.handleClick(this.props.img)} />
            </div>
        );
    }
}

export default Tumbnail;
