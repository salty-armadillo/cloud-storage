import React from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';

import { Link, useLocation } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import BackupIcon from '@material-ui/icons/Backup';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ListIcon from '@material-ui/icons/List';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

const styles = (theme) => ({
    paper: {
        height: "100vh",
        width: "5em",
        float: "left",
        marginRight: "1em",
        borderRadius: 0,
        borderRightStyle: "solid",
        borderRightWidth: "2px",
        borderRightColor: theme.palette.secondary.main
    },
    list: {
        margin: "auto 0"
    },
    listItem: {
        margin: "1em auto"
    },
    selectedListItem: {
        borderRightStyle: "solid",
        borderRightWidth: "0.25em",
        borderRightColor: theme.palette.primary.main
    }
})

export function NavSidebar(props) {

    const { classes } = props;

    const route = useLocation().pathname;

    return (
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
                    className={classes.listItem}
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
                    className={classes.listItem}
                >
                    <ListItemIcon>
                        <InsertDriveFileIcon fontSize={"large"}/>
                    </ListItemIcon>
                </ListItem>
            </List>
        </Paper>
    )

}

export default withStyles(styles)(NavSidebar);