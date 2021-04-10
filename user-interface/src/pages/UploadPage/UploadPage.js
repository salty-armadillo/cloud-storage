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
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';

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
    uploadButton: {
        marginLeft: "auto",
        marginRight: "0",
        display: "block"
    },
    successAlert: {
        backgroundColor: theme.palette.success.main
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
            submitError: "",
            submitSuccess: false
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
        const { filepath, generateNewKey, keyName, submitError, isFileUploading, submitSuccess } = this.state;

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
                        { isFileUploading
                            ? (
                                <CircularProgress className={classes.uploadButton}/>
                            ) : (
                                <Button
                                    className={classes.uploadButton}
                                    color="primary" 
                                    variant="contained"
                                    onClick={this.onUploadFile}
                                >
                                    Upload
                                </Button>
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