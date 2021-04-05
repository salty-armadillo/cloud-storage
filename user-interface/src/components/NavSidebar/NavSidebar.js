import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import { Link, useLocation } from 'react-router-dom';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import BackupIcon from '@material-ui/icons/Backup';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ListIcon from '@material-ui/icons/List';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

const styles = () => ({
    paper: {
        width: "5em"
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
            <Drawer
                classes={{ paper: classes.paper }}
                variant="persistent"
                anchor="left"
                open={true}
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
            </Drawer>
        )
    }

}

export default withStyles(styles)(NavSidebar);