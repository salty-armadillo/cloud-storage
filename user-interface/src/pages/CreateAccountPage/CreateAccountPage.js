import React from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
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
    createPanel: {
        height: "fit-content",
        padding: "2em",
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
        marginBottom: "1em",
        color: theme.palette.primary.dark
    },
    errorText: {
        textAlign: "center",
        color: theme.palette.error.main,
        margin: "0.8em"
    },
    submitButton: {
        width: "16em",
        textTransform: "none",
        color: "#FFFFFF",
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.dark
        }
    },
    cancelButton: {
        width: "16em",
        textTransform: "none",
        backgroundColor: theme.palette.secondary.dark,
        "&:hover": {
            backgroundColor: theme.palette.secondary.light
        }
    }
})

export class CreateAccountPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            email: "",
            password: "",
            isSubmitting: false,
            submitError: ""
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onUsernameChange = (e) => {
        this.setState({
            submitError: "",
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

    onEmailChange = (e) => {
        this.setState({
            loginError: "",
            emailError: "",
            email: e.target.value
        })
    }

    onSubmit = () => {
        const { username, email, password } = this.state;
        
        if (!username.trim()) {
            this.setState({
                usernameError: "Username cannot be empty."
            })
        } else if (!password.trim()) {
            this.setState({
                passwordError: "Password cannot be empty."
            })
        } else if (!email.trim()) {
            this.setState({
                emailError: "Email cannot be empty."
            })
        } else {
            this.setState({ isSubmitting: true, submitError: "" });

            const url = `${SERVER_ENDPOINT}/user/create`;
            const payload = {
                username: username,
                email: email,
                password: password
            }

            axios
                .post(url, payload)
                .then(() => {
                    this.login();
                })
                .catch((error) => {
                    this.setState({
                        isSubmitting: false,
                        submitError: error.response.data.description ? error.response.data.description : "An error has occurred. Please try again."
                    })
                })
        }
    }

    login = () => {
        const { history } = this.props;
        const { username, password } = this.state;

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
                ipcRenderer.send("login", {
                    userId: username,
                    token: token,
                    keyId: keyID
                })
                history.push("/upload");
            })
            .catch((error) => {
                this.setState({
                    isSubmitting: false,
                    submitError: error.response.data.description ? error.response.data.description : "An error has occurred. Please try again."
                });
            })
    }

    onCancel = () => {
        const { history } = this.props;
        history.push("/login");
    }

    render() {
        const { classes } = this.props;
        const {
            username,
            email,
            password,
            usernameError,
            emailError,
            passwordError,
            isSubmitting,
            submitError
        } = this.state;

        return (
            <React.Fragment>
                <Paper
                    className={classes.createPanel}
                    elevation={3}
                >
                    <Typography className={classes.title} variant={"h4"}>Create Account</Typography>
                    { submitError && <Typography className={classes.errorText} variant={"subtitle2"}>{submitError}</Typography> }
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
                                label="email"
                                variant="outlined"
                                value={email}
                                onChange={this.onEmailChange}
                                error={!!emailError}
                                helperText={emailError}
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
                                isSubmitting
                                    ? (
                                        <CircularProgress />
                                    ) : (
                                        <Button 
                                            className={classes.submitButton}
                                            variant="contained"
                                            onClick={this.onSubmit}
                                        >
                                            Submit
                                        </Button>
                                    )
                            }
                        </Grid>
                        <Grid item container xs={12} justify={"center"} alignContent={"center"}>
                            <Button 
                                className={classes.cancelButton}
                                variant="contained"
                                onClick={this.onCancel}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </React.Fragment>
        )
    }
}

CreateAccountPage.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(CreateAccountPage);