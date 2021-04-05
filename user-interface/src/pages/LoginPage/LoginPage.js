import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = () => ({
    loginPanel: {
        height: "25em",
        width: "50%",
        backgroundColor: "#d6d6d6",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: "auto"
    },
    title: {
        width: "100%",
        textAlign: "center",
        paddingTop: "1em",
        marginBottom: "1.5em",
        fontWeight: "bold"
    },
    loginButton: {
        width: "16em",
        backgroundColor: "#00c4a4",
        "&:hover": {
            backgroundColor: "#00a389"
        }
    }
})

export class LoginPage extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {}
    }

    onLogin = () => {
        this.props.login("userId", "token", "key");
        this.props.history.push("/upload");
    }

    render(){
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Paper
                    className={classes.loginPanel}
                    elevation={3}
                >
                    <Typography className={classes.title} variant={"h4"}>Login</Typography>
                    <Grid container spacing={2} justify={"center"} alignContent={"center"}>
                        <Grid item container xs={12} justify={"center"} alignContent={"center"}>
                            <TextField label="username" variant="outlined" />
                        </Grid>
                        <Grid item container xs={12} justify={"center"} alignContent={"center"}>
                            <TextField label="password" variant="outlined" type="password"/>
                        </Grid>
                        <Grid item container xs={12} justify={"center"} alignContent={"center"}>
                            <Button 
                                className={classes.loginButton}
                                variant="contained"
                                onClick={this.onLogin}
                            >
                                Login
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