import React from 'react';
import { HashRouter, Switch, Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

import { UploadPage } from './pages/UploadPage';
import { DownloadPage } from './pages/DownloadPage';
import { LoginPage } from './pages/LoginPage';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#1fb88b"
        },
        secondary: {
            main: "#e0e0e0"
        },
        contrastThreshold: 3,
    },
    typography: {
        fontFamily: [
            '"Verdana"',
            'Arial',
            'sans-serif'
        ].join(',')
    }
})


function App() {

    return (
        <div className="App">
            <HashRouter>
                <ThemeProvider
                    theme={responsiveFontSizes(theme)}
                >
                    <Switch>
                        <Route exact path="/">
                            <Redirect to="/login" />
                        </Route>
                        <Route path="/upload" component={UploadPage}/>
                        <Route path="/download" component={DownloadPage}/>
                        <Route path="/login" component={LoginPage} />
                    </Switch>
                </ThemeProvider>
            </HashRouter>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        loggedIn: state.loggedIn
    }
}

export default connect(mapStateToProps)(App);