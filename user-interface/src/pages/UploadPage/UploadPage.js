import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import { NavSidebar } from '../../components/NavSidebar';
import { DragDropBox } from '../../components/DragDropBox';

const styles = (theme) => ({
    pageContainer: {
        width: "calc(100vw - 5em)",
        marginLeft: "5em"
    },
    header: {
        height: "5em",
        padding: "1.5em 0",
        marginBottom: "1em"
    },
    headerTitle: {
        fontWeight: "bold",
        color: theme.palette.secondary.dark,
        paddingBottom: "0.5em"
    },
    headerSubtitle: {
        color: theme.palette.secondary.dark
    },
    panel: {
        backgroundColor: theme.palette.secondary.light,
        width: "100%",
        padding: "1em",
        boxSizing: "border-box"
    }
})

export class UploadPage extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            filepath: ""
        }
    }

    setFilepath = (filepath) => {
        this.setState({
            filepath: filepath
        })
    }

    render(){
        const { classes } = this.props;
        const { filepath } = this.state;

        return (
            <React.Fragment>
                <NavSidebar />
                <Container className={classes.pageContainer}>
                    <Box className={classes.header}>
                        <Typography className={classes.headerTitle} variant={"h4"}>Upload</Typography>
                        <Typography className={classes.headerSubtitle} variant={"subtitle2"}>Upload files to cloud storage. All files will be locally encrypted before being uploaded.</Typography>
                    </Box>
                    <Paper className={classes.panel}>
                        <DragDropBox
                            filepath={filepath}
                            setFilepath={this.setFilepath}
                        />
                    </Paper>
                </Container>
            </React.Fragment>
        )
    }

}

UploadPage.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(UploadPage);