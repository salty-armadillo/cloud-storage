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
import InputBase from '@material-ui/core/InputBase';
import Chip from '@material-ui/core/Chip';

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
    buttons: {
        margin: "0 0.25em"
    },
    errorText: {
        color: theme.palette.error.main
    },
    fileInput: {
        display: "none"
    },
    fileContainer: {
        padding: 0,
        margin: "0.25em 0"
    },
    buttonContainer: {
        padding: 0,
        width: "fit-content",
        display: "block",
        marginLeft: "auto",
        marginRight: 0
    },
    tableContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: "10px",
        marginBottom: "1em",
        overflowY: "scroll",
        maxHeight: "25em"
    },
    successAlert: {
        backgroundColor: theme.palette.success.main
    }
})

export class DownloadPage extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            files: [],
            isRetrievingFilenames: false,
            selectedFile: "",
            isFileDownloading: false,
            downloadSuccess: false,
            downloadError: "",
            locationPath: "",
            locationName: "",
            keyPath: "",
            keyName: ""
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

    openLocationSelect = () => {
        document.getElementById("location-select").click();
    }

    openKeySelect = () => {
        document.getElementById("key-select").click();
    }

    onLocationSelect = (e) => {
        if (e.target.files.length > 0) {
            const downloadLocation = e.target.files[0].path.split("\\").slice(0, -1).join("\\");
            const locationName = downloadLocation.split("\\")[downloadLocation.split("\\").length - 1];
            console.log(downloadLocation, locationName);
            this.setState({
                locationPath: downloadLocation,
                locationName: locationName
            })
        }
    }

    onKeySelect = (e) => {
        if (e.target.files.length > 0) {
            const keyPath = e.target.files[0].path;
            const keyName = keyPath.split("\\")[keyPath.split("\\").length - 1]
            this.setState({
                keyPath: keyPath,
                keyName: keyName
            })
        }
    }

    downloadFile = () => {
        const { locationPath, keyPath, selectedFile } = this.state;

        if (!locationPath) {
            console.log(this.state)
            this.setState({
                downloadError: "Please select a download location."
            })
        } else if (!keyPath) {
            this.setState({
                downloadError: "Please select a key to decrypt the file with."
            })
        } else {
            this.setState({ isFileDownloading: true, downloadError: "" });
            const wholeState = ipcRenderer.sendSync("getDetails");

            const url = `${SERVER_ENDPOINT}/download`;
            const headers = {
                "Authorization": wholeState.token,
                "key": wholeState.keyId
            }
            const payload = {
                filename: selectedFile,
                location: locationPath,
                keypath: keyPath
            }

            axios
                .post(url, payload, { headers: headers })
                .then(() => {
                    this.setState({
                        downloadSuccess: true,
                        selectedFile: "",
                        locationPath: "",
                        locationName: "",
                        keyPath: "",
                        keyName: "",
                        isFileDownloading: false
                    });
                })
                .catch((error) => {
                    this.setState({
                        isFileDownloading: false,
                        downloadError: error.response.data.description ? error.response.data.description : "An error has occurred. Please try again."
                    })
                })
        }
    }

    render(){
        const { classes } = this.props;
        const { 
            isRetrievingFilenames,
            files,
            selectedFile,
            isFileDownloading,
            downloadSuccess,
            downloadError,
            locationName,
            keyName
        } = this.state;

        return (
            <React.Fragment>
                <Snackbar
                    ContentProps={{ classes: { root: classes.successAlert }}}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={downloadSuccess}
                    onClose={() => { this.setState({ downloadSuccess: false }) }}
                    autoHideDuration={2000}
                    message="File downloaded successfully!"
                    key='file-download-alert'
                />
                <NavSidebar />
                <Container className={classes.pageContainer}>
                    <Box className={classes.header}>
                        <Typography className={classes.headerTitle} variant={"h4"}>Download</Typography>
                        <Typography className={classes.headerSubtitle} variant={"subtitle2"}>Download files from cloud storage. All files will be locally decrypted after being downloaded.</Typography>
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
                                                { !!downloadError &&
                                                    <TableRow>
                                                        <TableCell colSpan={2} className={classes.errorText}>
                                                            {downloadError}
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
                                    <Container className={classes.fileContainer}>
                                        <Typography style={{ display: "inline" }}>Select a download location: </Typography>
                                        { locationName
                                            ? (
                                                <Chip
                                                    className={classes.chip}
                                                    label={`${locationName}/`}
                                                    color="primary"
                                                    onDelete={() => {
                                                        this.setState({
                                                            locationPath: "",
                                                            locationName: ""
                                                        })
                                                    }}
                                                />
                                            ) : (
                                                <Button
                                                    className={classes.buttons}
                                                    color="primary"
                                                    onClick={this.openLocationSelect}
                                                >
                                                    Download location
                                                </Button>
                                            )
                                        }
                                        <input id="location-select" type="file" className={classes.fileInput} onChange={this.onLocationSelect} webkitdirectory="true" multiple/>
                                    </Container>
                                    <Container className={classes.fileContainer}>
                                        <Typography style={{ display: "inline" }}>Select a key to decrypt the file with: </Typography>
                                        { keyName
                                            ? (
                                                <Chip
                                                    className={classes.chip}
                                                    label={keyName}
                                                    color="primary"
                                                    onDelete={() => {
                                                        this.setState({
                                                            keyPath: "",
                                                            keyName: ""
                                                        })
                                                    }}
                                                />
                                            ) : (
                                                <Button
                                                    className={classes.buttons}
                                                    color="primary"
                                                    onClick={this.openKeySelect}
                                                >
                                                    Select key
                                                </Button>
                                            )
                                        }
                                        <InputBase id="key-select" type="file" className={classes.fileInput} onChange={this.onKeySelect}/>
                                    </Container>
                                    <Container className={classes.buttonContainer}>
                                        <Button
                                            disabled={!selectedFile}
                                            className={classes.buttons}
                                            onClick={() => { this.setState({ selectedFile: "" }) }}
                                        >
                                            Cancel
                                        </Button>
                                        { isFileDownloading
                                            ? (
                                                <CircularProgress size={30}/>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    disabled={!selectedFile}
                                                    className={classes.buttons}
                                                    onClick={this.downloadFile}
                                                >
                                                    Download
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

DownloadPage.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DownloadPage);