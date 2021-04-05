import React from 'react';
import { HashRouter, Switch, Redirect, Route } from 'react-router-dom';

import { NavSidebar } from './components/NavSidebar';
import { UploadPage } from './pages/UploadPage';
import { DownloadPage } from './pages/DownloadPage';

function App() {
    return (
        <div className="App">
            <HashRouter>
                <NavSidebar />
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/upload" />
                    </Route>
                    <Route path="/upload" component={UploadPage}/>
                    <Route path="/download" component={DownloadPage}/>
                </Switch>
            </HashRouter>
        </div>
    )
}

export default App;