import React from 'react';
import './loginRegister.css';

import { Typography, TextField, Button, Snackbar, Grid } from '@material-ui/core';
import axios from 'axios';

import { user } from '../../types';

const INPUT_NAMES = ['login_name', 'password', 'password_validation', 'first_name', 'last_name', 'location', 'occupation', 'description'];

type myProps = {
    callback: (text: string) => void,
    history: any,
    callbackUser: (user: user) => void
}

type myState = {
    errorsLogin: any,
    errorsRegister: any,
    register: {
        login_name: string,
        password: string,
        password_validation: string,
        first_name: string,
        last_name: string,
        location: string,
        occupation: string,
        description: string
    }
    succesMessage: boolean
}


class LoginRegister extends React.Component<myProps, myState> {
    constructor(props) {
        super(props);
        this.state = {
            errorsLogin: "",
            errorsRegister: "",
            register: {
                login_name: "",
                password: "",
                password_validation: "",
                first_name: "",
                last_name: "",
                location: "",
                occupation: "",
                description: ""
            },
            succesMessage: false
        };
    }


    componentDidMount() {
        this.props.callback('Please login');
    }


    handleLogin = (e) => {
        e.preventDefault();
        let login_name = e.target.login_name.value;
        let password = e.target.password.value;

        axios.post('/admin/login', { login_name: login_name, password: password })
            .then(res => {
                this.props.callbackUser(res.data);
                this.props.history.push('/users/' + res.data._id);
            })
            .catch(err => {
                console.log('err', err.response);
                this.setState({ errorsLogin: err.response.data.errors });
            });
    };


    handleRegister = (e) => {
        e.preventDefault();
        const data = {};

        INPUT_NAMES.forEach(name => {
            if (e.target[name] !== '') {
                data[name] = e.target[name].value;
            }
        });

        axios.post('/user', data)
            .then(() => this.setState({
                errorsRegister: "",
                succesMessage: true,
                register: {
                    login_name: "",
                    password: "",
                    password_validation: "",
                    first_name: "",
                    last_name: "",
                    location: "",
                    occupation: "",
                    description: ""
                }
            }))
            .catch(err => {
                console.log(err.response);
                this.setState({ errorsRegister: err.response.data.errors });
            });
    };

    handleChange = e => {
        e.preventDefault();
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevState => ({ register: { ...prevState.register, [name]: value } }));
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ succesMessage: false });
    };

    renderTextField(name) {
        let type = "text";
        let isError = false;
        let helperText = "";
        if (name === 'password' || name === "password_validation") {
            type = "password";
        }
        if (name === 'password_validation') {
            isError = this.state.register.password !== this.state.register.password_validation;
            helperText = isError ? "Passwords don't match" : "";
        }
        return (
            <TextField key={name} id="outlined-basic" name={name} value={this.state.register[name]}
                onChange={this.handleChange} type={type} label={name} variant="outlined"
                error={isError || this.state.errorsRegister[name] !== undefined}
                helperText={helperText || (this.state.errorsRegister[name] && this.state.errorsRegister[name].message)} />
        );
    }

    render() {
        return (
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h3">
                        Login
                    </Typography>
                    <Typography variant="body1" color="error">
                        For a quick demo try:                     
                    </Typography>
                    <Typography variant="body1" color="error">
                        username: malcolm                    
                    </Typography>
                    <Typography variant="body1" color="error">
                        password: weak                     
                    </Typography>
                    <form noValidate autoComplete="off" className="login-form" onSubmit={this.handleLogin}>
                        <TextField id="outlined-basic" name="login_name" label="Login name" variant="outlined"
                            error={this.state.errorsLogin.login_name !== undefined}
                            helperText={this.state.errorsLogin && this.state.errorsLogin.login_name} />
                        <TextField id="outlined-basic" name="password" label="Password" type="password" variant="outlined"
                            error={this.state.errorsLogin.password !== undefined}
                            helperText={this.state.errorsLogin && this.state.errorsLogin.password} />
                        <Button variant="contained" color="primary" type="submit">
                            Login
                        </Button>
                    </form>

                    <Typography variant="h3">
                        Register
                    </Typography>
                    <form id="register-form" noValidate autoComplete="off" className="login-form" onSubmit={this.handleRegister}>
                        {
                            INPUT_NAMES.map(name => this.renderTextField(name))
                        }
                        <Button variant="contained" color="primary" type="submit">
                            Register me
                        </Button>
                    </form>
                    <Snackbar open={this.state.succesMessage} autoHideDuration={6000} onClose={this.handleClose} message="New user registered" />
                </Grid>
            </Grid>
        );
    }
}

export default LoginRegister;