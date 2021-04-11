import React from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { NavSidebar } from '../../components/NavSidebar';
import { DragDropBox } from '../../components/DragDropBox';

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
        width: "100%",
        padding: "1em",
        boxSizing: "border-box"
    },
    submitErrorText: {
        color: theme.palette.error.main,
        margin: "0.5em 0"
    },
    keySelectContainer: {
        display: "flex",
        padding: 0
    },
    keyButton: {
        margin: "0 0.5em",
        padding: "0 0.5em"
    },
    keyInput: {
        display: "none"
    },
    keyChip: {
        margin: "0 0.5em"
    },
    submitButton: {
        marginLeft: "auto",
        marginRight: "0",
        display: "block"
    },
    button: {
        margin: "0 0.25em"
    },
    successAlert: {
        backgroundColor: theme.palette.success.main
    },
    scanningContainer: {
        padding: "1em",
        marginBottom: "1em"
    },
    title: {
        fontWeight: "bold",
        color: "#363636",
        marginBottom: "0.75em"
    },
    tableContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: "10px",
        marginBottom: "1em",
        overflowY: "scroll",
        maxHeight: "25em"
    },
    scanTableHeading: {
        fontWeight: "bold"
    },
    buttonContainer: {
        padding: 0,
        width: "fit-content",
        display: "block",
        marginLeft: "auto",
        marginRight: 0
    }
})

export class UploadPage extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            filepath: "",
            generateNewKey: false,
            keyPath: "",
            keyName: "",
            isFileUploading: false,
            isFileScanning: false,
            checkingFileScan: false,
            submitError: "",
            submitSuccess: false,
            scanIssues: []
        }
    }

    setFilepath = (filepath) => {
        this.setState({
            filepath: filepath
        })
    }

    toggleGenerateNewKey = () => {
        this.setState({
            generateNewKey: !this.state.generateNewKey
        })
    }

    openFileInput = () => {
        document.getElementById("key-select").click();
    }

    onKeySelect = (e) => {
        if (e.target.files.length > 0) {
            let keyPath = "";
            let keyName = "";
            if (this.state.generateNewKey) {
                keyPath = e.target.files[0].path.split("\\").split(0, -1).join("\\");
                keyName = keyPath.split("\\")[keyPath.split("\\").length - 1];
            } else {
                keyPath = e.target.files[0].path;
                keyName = keyPath.split("\\")[keyPath.split("\\").length - 1];
            }
            this.setState({
                keyPath: keyPath,
                keyName: keyName
            });
        }
    }

    onKeyDelete = () => {
        this.setState({
            keyPath: "",
            keyName: ""
        })
    }

    onScanFiles = () => {
        const { filepath, keyPath } = this.state;

        if (!filepath.trim()) {
            this.setState({ submitError: "Please select a file to upload." });
        } else if (!keyPath.trim()) {
            this.setState({ submitError: "Please select a key or a new key location." });
        } else {
            this.setState({ isFileScanning: true, submitError: "" });
            const wholeState = ipcRenderer.sendSync("getDetails");

            const url = `${SERVER_ENDPOINT}/upload/scan`;
            const headers = {
                "Authorization": wholeState.token,
                "key": wholeState.keyId
            }
            const payload = {
                filepath: filepath.replaceAll("\\", "/")
            }

            axios
                .post(url, payload, { headers: headers })
                .then((response) => {
                    const data = response.data;
                    this.setState({
                        isFileScanning: false,
                        checkingFileScan: true,
                        scanIssues: data
                    })
                })
                .catch((error) => {
                    this.setState({
                        isFileScanning: false,
                        submitError: error.response.data.description ? error.response.data.description : "An error has occurred. Please try again."
                    })
                })
        }
    }

    onCancel = () => {
        this.setState({
            filepath: "",
            keyPath: "",
            keyName: "",
            generateNewKey: false,
            isFileUploading: false,
            isFileScanning: false,
            checkingFileScan: false,
        })
    }

    onUploadFile = () => {
        const { filepath, keyPath, generateNewKey } = this.state;

        if (!filepath.trim()) {
            this.setState({ submitError: "Please select a file to upload." });
        } else if (!keyPath.trim()) {
            this.setState({ submitError: "Please select a key or a new key location." });
        } else {
            this.setState({ isFileUploading: true, submitError: "" });

            const wholeState = ipcRenderer.sendSync("getDetails");

            const url = `${SERVER_ENDPOINT}/upload`;
            const headers = {
                "Authorization": wholeState.token,
                "key": wholeState.keyId
            }
            const payload = {
                filepath: filepath.replaceAll("\\", "/"),
                [generateNewKey ? "keylocation" : "keypath"]: keyPath.replaceAll("\\", "/")
            }

            axios
                .post(url, payload, { headers: headers })
                .then(() => {
                    this.setState({
                        filepath: "",
                        keyPath: "",
                        keyName: "",
                        isFileUploading: false,
                        isFileScanning: false,
                        checkingFileScan: false,
                        submitSuccess: true
                    })
                })
                .catch((error) => {
                    this.setState({
                        isFileUploading: false,
                        submitError: error.response.data.description ? error.response.data.description : "An error has occurred. Please try again"
                    })
                })


        }
    }

    render(){
        const { classes } = this.props;
        const {
            filepath,
            generateNewKey,
            keyName,
            submitError,
            isFileUploading,
            isFileScanning,
            checkingFileScan,
            submitSuccess,
            scanIssues
        } = this.state;

        return (
            <React.Fragment>
                <Snackbar
                    ContentProps={{ classes: { root: classes.successAlert }}}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={submitSuccess}
                    onClose={() => { this.setState({ submitSuccess: false }) }}
                    autoHideDuration={2000}
                    message="File uploaded successfully!"
                    key='file-upload-alert'
                />
                <NavSidebar />
                <Container className={classes.pageContainer}>
                    <Box className={classes.header}>
                        <Typography className={classes.headerTitle} variant={"h4"}>Upload</Typography>
                        <Typography className={classes.headerSubtitle} variant={"subtitle2"}>Upload files to cloud storage. All files will be locally encrypted before being uploaded.</Typography>
                    </Box>
                    <Paper className={classes.panel}>
                        { submitError && <Typography className={classes.submitErrorText}>{submitError}</Typography>}
                        { 
                            (isFileScanning || isFileUploading || checkingFileScan)
                                ? (
                                    <React.Fragment>
                                        { isFileScanning && (
                                            <Paper className={classes.scanningContainer}>
                                                <Typography variant={"h6"} className={classes.title}>
                                                    Scanning...
                                                </Typography>
                                                <LinearProgress color="primary" />
                                            </Paper>
                                        )}
                                        { checkingFileScan && (
                                            <div className={classes.tableContainer}>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell className={classes.scanTableHeading}>Filename</TableCell>
                                                            <TableCell className={classes.scanTableHeading}>Reason</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        { (scanIssues.length > 0)
                                                            ? (
                                                                scanIssues.map((issue) => {
                                                                    return (
                                                                        <TableRow key={`${issue.filename}-${issue.error}`}>
                                                                            <TableCell>
                                                                                {issue.filename}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {issue.error}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )
                                                                })
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell align="center" colSpan={2}>No issues found! Select <b>Upload</b> to continue.</TableCell>
                                                                </TableRow>
                                                            )
                                                        }
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        )}
                                        <Container className={classes.buttonContainer}>
                                            <Button
                                                className={classes.button}
                                                onClick={this.onCancel}
                                                disabled={isFileScanning || isFileUploading}
                                            >
                                                Cancel
                                            </Button>
                                            { isFileUploading
                                                ? (
                                                    <CircularProgress size={30} />
                                                ) : (
                                                    <Button
                                                        className={classes.button}
                                                        color="primary" 
                                                        variant="contained"
                                                        disabled={isFileScanning}
                                                        onClick={this.onUploadFile}
                                                    >
                                                        Upload
                                                    </Button>
                                                )}
                                        </Container>
                                    </React.Fragment>
                                ) : (
                                        <React.Fragment>
                                            <DragDropBox
                                                filepath={filepath}
                                                setFilepath={this.setFilepath}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={generateNewKey}
                                                        onChange={this.toggleGenerateNewKey}
                                                        color="primary"
                                                    />
                                                }
                                                label="Generate a new key"
                                            />
                                            <Container className={classes.keySelectContainer}>
                                                <Typography>
                                                    { generateNewKey ? "Select a location for your new key: " : "Select a key to encrypt your file with:" }
                                                </Typography>
                                                { !keyName
                                                    ? ( 
                                                        <Button 
                                                            className={classes.keyButton}
                                                            color="primary" 
                                                            onClick={this.openFileInput}
                                                        >
                                                            { generateNewKey ? "Choose location" : "Choose key" }
                                                        </Button>
                                                    ) : (
                                                        <Chip
                                                            className={classes.keyChip}
                                                            label={keyName}
                                                            color="primary" 
                                                            onDelete={this.onKeyDelete}
                                                        />
                                                    )
                                                }
                                                { generateNewKey
                                                    ? (
                                                        <input id="key-select" type="file" className={classes.keyInput} onChange={this.onKeySelect} webkitdirectory="true" multiple/>
                                                    ) : (
                                                        <InputBase id="key-select" type="file" className={classes.keyInput} onChange={this.onKeySelect}/>
                                                    )
                                                    
                                                }
                                            </Container>
                                            <Button
                                                className={classes.submitButton}
                                                color="primary" 
                                                variant="contained"
                                                onClick={this.onScanFiles}
                                            >
                                                Submit
                                            </Button>
                                        </React.Fragment>
                                )
                        }
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