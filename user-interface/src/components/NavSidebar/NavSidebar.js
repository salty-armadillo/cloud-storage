import React, { useState } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import { ipcRenderer } from 'electron';
import { Redirect } from 'react-router-dom';

import { Link, useLocation } from 'react-router-dom';

import Snackbar from '@material-ui/core/Snackbar';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import BackupIcon from '@material-ui/icons/Backup';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ListIcon from '@material-ui/icons/List';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';

import { SERVER_ENDPOINT } from '../../constants';

const styles = (theme) => ({
    paper: {
        height: "90vh",
        width: "5em",
        float: "left",
        marginRight: "1.5em",
        borderRadius: 0,
        borderRightStyle: "solid",
        borderRightWidth: "2px",
        borderRightColor: theme.palette.secondary.main
    },
    list: {
        marginTop: "7em"
    },
    listItem: {
        margin: "1em auto"
    },
    selectedListItem: {
        borderRightStyle: "solid",
        borderRightWidth: "0.25em",
        borderRightColor: theme.palette.primary.main
    },
    successAlert: {
        backgroundColor: theme.palette.success.main
    },
    progress: {
        margin: 0,
        padding: "1em"
    }
})

export function NavSidebar(props) {

    const { classes } = props;
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const route = useLocation().pathname;

    const logout = () => {
        setIsSubmitting(true);
        const wholeState = ipcRenderer.sendSync("getDetails");
        const url = `${SERVER_ENDPOINT}/user/logout`;
        const headers = {
            "Authorization": wholeState.token,
            "key": wholeState.keyId
        }

        axios
            .post(url, { headers: headers })
            .then(() => {
                ipcRenderer.send("logout");
                setSubmitSuccess(true);
            })
            .catch((error) => {
                console.log(error);
                setIsSubmitting(false);
            })
    }

    return (
        <React.Fragment>
            <Snackbar
                    ContentProps={{ classes: { root: classes.successAlert }}}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={submitSuccess}
                    onClose={() => { setSubmitSuccess(false) }}
                    autoHideDuration={2000}
                    message="Logged out successfully!"
                    key='logout-success-alert'
                />
            <Paper
                className={classes.paper}
                elevation={0}
            >
                <List className={classes.list}>
                    <ListItem 
                        button 
                        className={
                            clsx(classes.listItem, {
                                [classes.selectedListItem]: route === "/upload"
                            })
                        } 
                        component={Link} 
                        to="/upload"
                    >
                        <ListItemIcon>
                            <BackupIcon fontSize={"large"}/>
                        </ListItemIcon>
                    </ListItem>
                    <ListItem
                        button
                        className={
                            clsx(classes.listItem, {
                                [classes.selectedListItem]: route === "/download"
                            })
                        } 
                        component={Link}
                        to="/download"
                    >
                        <ListItemIcon>
                            <CloudDownloadIcon fontSize={"large"}/>
                        </ListItemIcon>
                    </ListItem>
                    <ListItem
                        button
                        className={
                            clsx(classes.listItem, {
                                [classes.selectedListItem]: route === "/activities"
                            })
                        } 
                        component={Link}
                        to="/activities"
                    >
                        <ListItemIcon>
                            <ListIcon fontSize={"large"}/>
                        </ListItemIcon>
                    </ListItem>
                    <ListItem
                        button
                        className={
                            clsx(classes.listItem, {
                                [classes.selectedListItem]: route === "/files"
                            })
                        } 
                        component={Link}
                        to="/files"
                    >
                        <ListItemIcon>
                            <InsertDriveFileIcon fontSize={"large"}/>
                        </ListItemIcon>
                    </ListItem>
                    { !isSubmitting
                        ? (
                            <ListItem
                                button
                                className={classes.listItem}
                                onClick={logout}
                            >
                                <ListItemIcon>
                                    <ExitToAppIcon fontSize={"large"}/>
                                </ListItemIcon>
                            </ListItem>
                        ) : (
                            <CircularProgress classes={{ root: classes.progress }}/>
                        )
                    }
                </List>
            </Paper>
            { submitSuccess && <Redirect to="/login" />}
        </React.Fragment>
    )

}

export default withStyles(styles)(NavSidebar);