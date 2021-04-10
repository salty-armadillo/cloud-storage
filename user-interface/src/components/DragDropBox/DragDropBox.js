import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';

const styles = (theme) => ({
    paper: {
        height: "60%",
        minHeight: "12em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderStyle: "dashed",
        borderWidth: "0.15em",
        borderColor: theme.palette.primary.main
    },
    paperFileOver: {
        opacity: "0.5",
        backgroundColor: theme.palette.primary.light
    },
    dragDropText: {
        pointerEvents: "none",
        color: "#363636"
    },
    iconBox: {
        pointerEvents: "none",
        opacity: "0.75",
        backgroundColor: theme.palette.primary.light,
        borderRadius: "50%",
        padding: "0.5em",
        marginBottom: "0.5em"
    },
    fileBox: {
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: theme.palette.secondary.main,
        padding: "0.5em",
        // borderRadius: "10%"
    },
    fileIcon: {
        pointerEvents: "none",
        fontSize: "5em"
    }
})

export class DragDropBox extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            filename: "",
            isFileOver: false,
        }
    }

    onFileDragEnter = (e) => {
        this.setState({ isFileOver: true });
        e.preventDefault();
        e.stopPropagation();
    }

    onFileDragLeave = (e) => {
        this.setState({ isFileOver: false });
        e.preventDefault();
        e.stopPropagation();
    }

    onFileDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    onFileDrop = (e) => {
        if (e.dataTransfer.files.length > 0) {
            const filepath = e.dataTransfer.files[0].path;
            const filename = filepath.split("\\")[filepath.split("\\").length - 1];
            this.setState({
                filename: filename,
                isFileOver: false
            }, () => {
                this.props.setFilepath(filepath);
            });
        }
        e.preventDefault();
        e.stopPropagation();
    }

    render() {
        const { classes, filepath } = this.props;
        const { isFileOver, filename } = this.state;

        return (
            <Paper 
                className={clsx(classes.paper, {
                    [classes.paperFileOver]: isFileOver
                })} 
                elevation={0}
                onDragEnter={this.onFileDragEnter}
                onDragLeave={this.onFileDragLeave}
                onDragOver={this.onFileDragOver}
                onDrop={this.onFileDrop}
            >
                { !filepath || isFileOver
                    ? (
                        <Typography 
                            className={classes.dragDropText}
                            variant={'subtitle1'}
                        >
                            Drag and drop files here to upload!
                        </Typography>
                    ) : (
                        <Paper className={classes.fileBox}>
                            <Box className={classes.iconBox}>
                                <InsertDriveFileOutlinedIcon className={classes.fileIcon}/>
                            </Box>
                            <Typography variant={'subtitle2'}>{filename}</Typography>
                        </Paper>
                    )
                }
            </Paper>
        )
    }

}

DragDropBox.propTypes = {
    classes: PropTypes.object.isRequired,
    filepath: PropTypes.string.isRequired,
    setFilepath: PropTypes.func.isRequired
}

export default withStyles(styles)(DragDropBox);