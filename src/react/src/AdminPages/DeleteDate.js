import React from 'react';
import * as Constants from '../GlobalPages/Constants' ;
import * as BasePage from '../GlobalPages/BasePage';

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import ButtonWithLoading from '../GlobalPages/ButtonWithLoading';

const DeleteDate = (props) =>
{
    function handleDeleteDateDialogShow()
    {
        props.scope.setState({isDeleteDialogShow: true});
    }

    function handleDeleteDateDialogHide()
    {
        props.scope.setState({isDeleteDialogShow: false});
    }

    async function handleDeleteDateSubmit(event)
    {
        // we need to send the NOTSELECTED dates to the server
        // to update the server

        if(props.scope.state.isLoadingDeleteDate)
            return;

        props.scope.setState({isLoadingDeleteDate: true});
        
        var notSelectedDates = [];

        for(var i = 0; i < props.scope.state.dates.length; i++)
        {
            if(!props.scope.state.dates[i].isSelected)
            {
                notSelectedDates.push(
                    props.scope.state.dates[i].date
                );
            }
        }
        
        try
        {
            var url;
            url = Constants.getRoot() + Constants.deleteDates;

            let body = JSON.stringify({
                username : props.userData.username,
                dates : notSelectedDates
            });

            let res = await BasePage.CallApiPost(url, body);
            if(res.status === 200)
            {   
                props.scope.setState({isLoadingDeleteDate: false});
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
            props.scope.setState({isLoadingDeleteDate: false});
        }
        
    }


    return(
        <div>
            <Tooltip title="Delete dates">
                <Badge 
                    color="secondary" 
                    badgeContent={props.scope.state.selectedDateNumber} style={{float: 'right', marginRight: 20}}>
                    
                    <IconButton 
                        aria-label="Delete" 
                        disabled = {props.disabled}
                        onClick = {handleDeleteDateDialogShow}>
                        <DeleteIcon />
                    </IconButton>
                </Badge>
            </Tooltip>

            <Dialog
                open={props.scope.state.isDeleteDialogShow}
                onClose = {handleDeleteDateDialogHide}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
                
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you want to delete selected dates for {props.userData.username}?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleDeleteDateDialogHide} color="secondary">
                        Disagree
                    </Button>
                    
                    <ButtonWithLoading
                        handleSubmit = {handleDeleteDateSubmit}
                        isLoading = {props.scope.state.isLoadingDeleteDate}
                        // TO DO: fix circleIcon prop.
                        circleIcon = {'81%'}
                    />
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default DeleteDate;