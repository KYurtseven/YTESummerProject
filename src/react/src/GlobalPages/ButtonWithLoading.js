import React from 'react';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const ButtonWithLoading = (props) =>
{   

    return(

        <div className={props.wrapper}>

            <Button 
                onClick={props.handleSubmit} 
                color="secondary" 
                autoFocus
                disabled={props.isLoading}
            >
                Submit
            </Button>
                    
            {props.isLoading &&
                <CircularProgress 
                    size={16} 
                    // hard coded style
                    // TO DO, fix it like in Login.js
                    style={{
                        color: 'secondary',
                        position: 'absolute',
                        top: props.circleIcon,
                        marginLeft: -50,
                    }}
                />
            }
        </div>
    )
}

const styles = theme => ({
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative',
      },
});

ButtonWithLoading.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonWithLoading);
