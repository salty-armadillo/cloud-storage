import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import { NavSidebar } from '../../components/NavSidebar';

const styles = () => ({

})

export class UploadPage extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {}
    }

    render(){
        return (
            <React.Fragment>
                <NavSidebar />
                <div>upload</div>
            </React.Fragment>
        )
    }

}

UploadPage.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(UploadPage);