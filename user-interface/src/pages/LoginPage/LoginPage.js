import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

const styles = () => ({

})

export class LoginPage extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {}
    }

    render(){
        return (
            <div>login</div>
        )
    }

}

LoginPage.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(LoginPage);