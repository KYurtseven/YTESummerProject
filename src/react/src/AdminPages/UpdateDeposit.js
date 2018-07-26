import React from 'react';
import * as Constants from '../GlobalPages/Constants' ;
import * as BasePage from '../GlobalPages/BasePage';


import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ButtonWithLoading from '../GlobalPages/ButtonWithLoading';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const UpdateDeposit = (props) =>
{

    function handleUpdateDepositHide()
    {
        props.scope.setState({isUpdateDepositShow: false});
    }

    function handleDepositChange(event)
    {
        props.scope.setState({depositValue: event.target.value});
    }

    // post to the database
    async function handleDepositSubmit(event)
    {
        if(!isNaN(props.scope.state.depositValue))
        {
            if(props.scope.state.isLoadingDeposit)
                return;

            props.scope.setState({isLoadingDeposit: true});
            
            var url;
            url = Constants.getRoot() + Constants.updateDeposit;

            let body = JSON.stringify({
                username : props.userData.username,
                deposit : props.scope.state.depositValue
            });
            
            try
            { 
                let res = await BasePage.CallApiPost(url, body);
                if(res.status === 200)
                {
                    props.scope.setState({isLoadingDeposit: false});
                    await props.fetchDataAgain();
                    // this page will be automatically re-rendered
                }
                else
                    throw(Constants.postNot200);
                
            }
            catch(e)
            {
                props.scope.setState({error: e});
                console.log('Error on deposit submit' + props.scope.state.error);
                props.scope.setState({isLoadingDeposit: false});
            }
            
        }
        else
        {
            alert("Please enter an integer");
        }
    }

    return(
        <Dialog
            open={props.scope.state.isUpdateDepositShow}
            onClose = {handleUpdateDepositHide}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">{"Update Deposit for "}{props.userData.username}</DialogTitle>
            <DialogContent>
                <form style={{display: 'flex',flexWrap: 'wrap',}} noValidate>
                    <TextField
                        id="deposit"
                        label="New Deposit"
                        type="number"
                        onChange={handleDepositChange}
                        style={{flex:1}}
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleUpdateDepositHide} color="secondary">
                    Cancel
                </Button>
                
                <ButtonWithLoading
                    handleSubmit = {handleDepositSubmit}
                    isLoading = {props.scope.state.isLoadingDeposit}
                    // TO DO: fix circleIcon prop.
                    circleIcon = {'83%'}
                />

            </DialogActions>
        </Dialog>
    );

}

const styles = theme => ({
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative',
      },
});

UpdateDeposit.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UpdateDeposit);
