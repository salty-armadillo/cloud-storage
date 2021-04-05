import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

const styles = () => ({

})

export class UploadPage extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {}
    }

    render(){
        return (
            <div>upload</div>
        )
    }

}

UploadPage.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(UploadPage);