import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { NavSidebar } from '../../components/NavSidebar';

const styles = (theme) => ({
    header: {
        height: "5em",
        width: "calc(100vw - 4em)",
        padding: "2em"
    },
    headerTitle: {
        fontWeight: "bold",
        color: theme.palette.secondary.dark,
        paddingBottom: "0.5em"
    },
    headerSubtitle: {
        color: theme.palette.secondary.dark
    }
})

export class UploadPage extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {}
    }

    render(){
        const { classes } = this.props;

        return (
            <React.Fragment>
                <NavSidebar />
                <Box className={classes.header}>
                    <Typography className={classes.headerTitle} variant={"h4"}>Upload</Typography>
                    <Typography className={classes.headerSubtitle} variant={"subtitle2"}>Upload files to cloud storage. All files will be locally encrypted before being uploaded.</Typography>
                </Box>
            </React.Fragment>
        )
    }

}

UploadPage.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(UploadPage);