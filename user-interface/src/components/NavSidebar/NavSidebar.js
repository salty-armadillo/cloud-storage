import React from 'react';
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
    }
})

export class NavSidebar extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {
        const { classes } = this.props;

        return (
            <Paper
                className={classes.paper}
                elevation={0}
            >
                <List className={classes.list}>
                    <ListItem button className={classes.listItem} component={Link} to="/upload">
                        <ListItemIcon>
                            <BackupIcon fontSize={"large"}/>
                        </ListItemIcon>
                    </ListItem>
                    <ListItem button className={classes.listItem} component={Link} to="/download">
                        <ListItemIcon>
                            <CloudDownloadIcon fontSize={"large"}/>
                        </ListItemIcon>
                    </ListItem>
                    <ListItem button className={classes.listItem}>
                        <ListItemIcon>
                            <ListIcon fontSize={"large"}/>
                        </ListItemIcon>
                    </ListItem>
                    <ListItem button className={classes.listItem}>
                        <ListItemIcon>
                            <InsertDriveFileIcon fontSize={"large"}/>
                        </ListItemIcon>
                    </ListItem>
                </List>
            </Paper>
        )
    }

}

export default withStyles(styles)(NavSidebar);