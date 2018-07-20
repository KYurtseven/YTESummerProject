import React from 'react';
import * as Constants from '../GlobalPages/Constants' ;
import * as BasePage from '../GlobalPages/BasePage';


import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';


const AddDate = (props) =>
{

    function handleAddDateDialogShow()
    {
        props.scope.setState({isAddDateDialogShow: true});
    }

    function handleAddDateDialogHide()
    {
        props.scope.setState({isAddDateDialogShow: false});
    }
    
    function handleDateChange(event)
    {
        props.scope.setState({dateValue: event.target.value});
    }

    // post to the database
    async function handleAddDateSubmit(event)
    {
        if(BasePage.isValidDate(props.scope.state.dateValue) === 'success')
        {
            var url;
            url = Constants.getRoot() + Constants.addDate;

            let body = JSON.stringify({
                username : props.userData.username,
                date : props.scope.state.dateValue
            });

            try
            {
                let res = await BasePage.CallApiPost(url, body);
                if(res.status === 200)
                {
                    await props.fetchDataAgain();
                }
                else
                    throw(Constants.postNot200);
            }
            catch(e)
            {
                props.scope.setState({error: e});
                console.log('Error on date submit: ' + props.scope.state.error);
            }
        }
        else
        {
            alert('Please enter date as yyyy-MM-dd, entered value was: ' + props.scope.state.dateValue);
        }
    }

    return(
        <div>
        <Tooltip title="Add dates">
            <IconButton 
                aria-label="Add" 
                style={{float: 'right'}}
                onClick = {handleAddDateDialogShow}>
                <AddIcon />
            </IconButton>
        </Tooltip>

        <Dialog
            open={props.scope.state.isAddDateDialogShow}
            onClose = {handleAddDateDialogHide}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">{"Add a date for "}{props.userData.username}</DialogTitle>
            <DialogContent>
                <form style={{display: 'flex',flexWrap: 'wrap',}} noValidate>
                    <TextField
                        id="date"
                        label="New Date"
                        type="date"
                        onChange={handleDateChange}
                        style={{width: 200}}
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAddDateDialogHide} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleAddDateSubmit} color="primary" autoFocus>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>

        </div>
    );
}
export default AddDate;