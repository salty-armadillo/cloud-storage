import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import { NavSidebar } from '../../components/NavSidebar';

const styles = () => ({

})

export class DownloadPage extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {}
    }

    render(){
        return (
            <React.Fragment>
                <NavSidebar />
                <div>download</div>
            </React.Fragment>
        )
    }

}

DownloadPage.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DownloadPage);