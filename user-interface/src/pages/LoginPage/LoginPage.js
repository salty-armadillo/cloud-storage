import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { SERVER_ENDPOINT } from '../../constants';

const styles = (theme) => ({
    loginPanel: {
        height: "25em",
        width: "50%",
        backgroundColor: theme.palette.secondary.light,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: "auto"
    },
    title: {
        textAlign: "center",
        paddingTop: "1em",
        marginBottom: "1em",
        color: theme.palette.primary.dark
    },
    errorText: {
        textAlign: "center",
        color: theme.palette.error.main,
        margin: "0.8em"
    },
    loginButton: {
        width: "16em",
        textTransform: "none",
        color: "#FFFFFF",
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.dark
        }
    },
    createButton: {
        width: "16em",
        textTransform: "none",
        backgroundColor: theme.palette.secondary.dark,
        "&:hover": {
            backgroundColor: theme.palette.secondary.light
        }
    }
})

export class LoginPage extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            isLoggingIn: false,
            loginError: ""
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onUsernameChange = (e) => {
        this.setState({
            loginError: "",
            usernameError: "",
            username: e.target.value
        })
    }

    onPasswordChange = (e) => {
        this.setState({
            loginError: "",
            passwordError: "",
            password: e.target.value
        })
    }

    onLogin = () => {
        const { login, history } = this.props;
        const { username, password } = this.state;

        if (!username.trim()) {
            this.setState({
                usernameError: "Username cannot be empty."
            })
        } else if (!password.trim()) {
            this.setState({
                passwordError: "Password cannot be empty."
            })
        } else {
            this.setState({ isLoggingIn: true });

            const url = `${SERVER_ENDPOINT}/user/login`;
            const payload = {
                "username": username,
                "password": password
            }
                axios
                    .post(url, payload)
                    .then((response) => {
                        const data = response.data;
                        const keyID = data && data.publicKeyID;
                        const token = data && data.token;
                        login(username, token, keyID);
                        history.push("/upload");
                    })
                    .catch((error) => {
                        this.setState({
                            isLoggingIn: false,
                            loginError: error.response.data.description ? error.response.data.description : "An error has occurred. Please try again."
                        });
                    })
        }
    }

    onCreateAccount = () => {
        
    }

    render(){
        const { classes } = this.props;
        const { username, password, usernameError, passwordError, isLoggingIn, loginError } = this.state;

        return (
            <React.Fragment>
                <Paper
                    className={classes.loginPanel}
                    elevation={3}
                >
                    <Typography className={classes.title} variant={"h4"}>Login</Typography>
                    { loginError && <Typography className={classes.errorText} variant={"subtitle2"}>{loginError}</Typography> }
                    <Grid container spacing={2} justify={"center"} alignContent={"center"}>
                        <Grid item container xs={12} justify={"center"} alignContent={"center"}>
                            <TextField 
                                label="username"
                                variant="outlined"
                                value={username}
                                onChange={this.onUsernameChange}
                                error={!!usernameError}
                                helperText={usernameError}
                            />
                        </Grid>
                        <Grid item container xs={12} justify={"center"} alignContent={"center"}>
                            <TextField
                                label="password"
                                variant="outlined"
                                type="password"
                                value={password}
                                onChange={this.onPasswordChange}
                                error={!!passwordError}
                                helperText={passwordError}
                            />
                        </Grid>
                        <Grid item container xs={12} justify={"center"} alignContent={"center"}>
                            { 
                                isLoggingIn
                                    ? (
                                        <CircularProgress />
                                    ) : (
                                        <Button 
                                            className={classes.loginButton}
                                            variant="contained"
                                            onClick={this.onLogin}
                                        >
                                            Login
                                        </Button>
                                    )
                            }
                        </Grid>
                        <Grid item container xs={12} justify={"center"} alignContent={"center"}>
                            <Button 
                                className={classes.createButton}
                                variant="contained"
                                onClick={this.onCreateAccount}
                            >
                                Create an account
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </React.Fragment>
        )
    }

}

LoginPage.propTypes = {
    classes: PropTypes.object.isRequired
}

function mapDispatchToProps(dispatch) {
    return {
        login: (userId, token, keyID) => {
            dispatch({ type: "LOGIN_USER", payload: {
                userId: userId,
                token: token,
                keyId: keyID
            }})
        }
    }
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(LoginPage));