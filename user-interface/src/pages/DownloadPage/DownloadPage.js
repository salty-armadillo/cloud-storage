import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

const styles = () => ({

})

export class DownloadPage extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {}
    }

    render(){
        return (
            <div>download</div>
        )
    }

}

DownloadPage.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DownloadPage);