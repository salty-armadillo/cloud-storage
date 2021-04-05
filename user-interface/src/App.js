import React from 'react';
import { HashRouter, Switch, Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { NavSidebar } from './components/NavSidebar';
import { UploadPage } from './pages/UploadPage';
import { DownloadPage } from './pages/DownloadPage';
import { LoginPage } from './pages/LoginPage';

function App({ loggedIn }) {

    return (
        <div className="App">
            <HashRouter>
                { loggedIn && <NavSidebar /> }
                <Switch>
                    <Route exact path="/">
                        <Redirect to={loggedIn ? "/upload" : "/login"} />
                    </Route>
                    <Route path="/upload" component={UploadPage}/>
                    <Route path="/download" component={DownloadPage}/>
                    <Route path="/login" component={LoginPage} />
                </Switch>
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