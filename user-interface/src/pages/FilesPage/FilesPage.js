import React from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

import { NavSidebar } from '../../components/NavSidebar';
import { SERVER_ENDPOINT } from '../../constants';

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
        padding: "1em",
        boxSizing: "border-box"
    },
    tableHeading: {
        color: theme.palette.primary.main,
        fontWeight: "bold"
    },
    tableContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: "10px",
        marginBottom: "1em",
        overflowY: "scroll",
        maxHeight: "25em"
    },
    buttonContainer: {
        padding: 0,
        width: "fit-content",
        display: "block",
        marginLeft: "auto",
        marginRight: 0
    },
    deleteButton: {
        marginLeft: "0.5em",
        backgroundColor: theme.palette.error.light,
        "&:hover": {
            backgroundColor: theme.palette.error.main
        }
    },
    successAlert: {
        backgroundColor: theme.palette.success.main
    }
})

export class FilesPage extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            files: [],
            isRetrievingFilenames: false,
            selectedFile: "",
            isFileDeleting: false,
            deleteError: "",
            deleteSuccess: false
        }
    }

    componentDidMount() {
        this.getFiles();
    }

    getFiles = () => {
        this.setState({ isRetrievingFilenames: true });
        const wholeState = ipcRenderer.sendSync("getDetails");

        const url = `${SERVER_ENDPOINT}/filenames`;
        const headers = {
            "Authorization": wholeState.token,
            "key": wholeState.keyId
        }

        axios
            .get(url, { headers: headers })
            .then((response) => {
                const data = response.data;
                this.setState({
                    files: data
                })
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                this.setState({ isRetrievingFilenames: false })
            })
    }

    handleFileSelect = (e) => {
        this.setState({ selectedFile: e.target.value });
    }

    deleteFile = () => {
        const { selectedFile } = this.state;

        this.setState({ isFileDeleting: true });
        const wholeState = ipcRenderer.sendSync("getDetails");

        const url = `${SERVER_ENDPOINT}/file?filename=${selectedFile}`;
        const headers = {
            "Authorization": wholeState.token,
            "key": wholeState.keyId
        }

        axios
            .delete(url, { headers: headers })
            .then(() => {
                this.setState({
                    selectedFile: "",
                    deleteSuccess: true,
                    isFileDeleting: false
                }, this.getFiles)
            })
            .catch((error) => {
                this.setState({
                    isFileDeleting: false,
                    deleteError: error.response.data.description ? error.response.data.description : "An error has occurred. Please try again."
                })
            })
    }

    render() {
        const { classes } = this.props;
        const { 
            isRetrievingFilenames,
            files,
            selectedFile,
            isFileDeleting,
            deleteSuccess,
            deleteError
        } = this.state;

        return (
            <React.Fragment>
                <Snackbar
                    ContentProps={{ classes: { root: classes.successAlert }}}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={deleteSuccess}
                    onClose={() => { this.setState({ deleteSuccess: false }) }}
                    autoHideDuration={2000}
                    message="File deleted successfully!"
                    key='file-delete-alert'
                />
                <NavSidebar />
                <Container className={classes.pageContainer}>
                    <Box className={classes.header}>
                        <Typography className={classes.headerTitle} variant={"h4"}>View Files</Typography>
                        <Typography className={classes.headerSubtitle} variant={"subtitle2"}>View all files and delete files currently uploaded in cloud storage. Deletion cannot be undone so perform this action carefully.</Typography>
                    </Box>
                    <Paper className={classes.panel}>
                        { isRetrievingFilenames 
                            ? (
                                <CircularProgress style={{ display: "block", margin: "auto" }}/>
                            ) : (
                                <React.Fragment>
                                    <div className={classes.tableContainer}>
                                        <Table className={classes.table}>
                                            <TableHead>
                                                { !!deleteError &&
                                                    <TableRow>
                                                        <TableCell colSpan={2} className={classes.errorText}>
                                                            {deleteError}
                                                        </TableCell>
                                                    </TableRow>
                                                }
                                                <TableRow>
                                                    <TableCell colSpan={2}>
                                                        <Typography variant={"h6"} className={classes.tableHeading}>Files</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                { files.map((file) => (
                                                    <TableRow key={file}>
                                                        <TableCell>
                                                            <Radio
                                                                checked={selectedFile === file}
                                                                onChange={this.handleFileSelect}
                                                                value={file}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            {file}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <Container className={classes.buttonContainer}>
                                        <Button
                                            disabled={!selectedFile}
                                            className={classes.buttons}
                                            onClick={() => { this.setState({ selectedFile: "" }) }}
                                        >
                                            Cancel
                                        </Button>
                                        { isFileDeleting
                                            ? (
                                                <CircularProgress size={30}/>
                                            ) : (
                                                <Button
                                                    classes={{ root: classes.deleteButton }}
                                                    variant="contained"
                                                    disabled={!selectedFile}
                                                    className={classes.buttons}
                                                    onClick={this.deleteFile}
                                                >
                                                    Delete
                                                </Button>
                                            )
                                        }
                                    </Container>
                                </React.Fragment>
                            )
                        }
                    </Paper>
                </Container>
            </React.Fragment>
        )
    }
}

FilesPage.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(FilesPage);