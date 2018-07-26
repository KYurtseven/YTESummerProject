import React from 'react';
import * as Constants from '../GlobalPages/Constants' ;
import * as BasePage from '../GlobalPages/BasePage';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import DateRange from '@material-ui/icons/DateRange';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import ButtonWithLoading from '../GlobalPages/ButtonWithLoading';

const AddDateForMultiUser = (props) =>
{
    function showAddShowMultiDateDialog()
    {
        props.scope.setState({isShowMultiDateDialog: true});
    }

    function hideAddShowMultiDateDialog()
    {
        props.scope.setState({isShowMultiDateDialog: false});    
    }
    
    function handleDateChange(event)
    {
        props.scope.setState({dateValueForMultiUser: event.target.value});
    }

    // post to the database
    async function handleAddDateToMultipleUserSubmit(event)
    {
        if(BasePage.isValidDate(props.scope.state.dateValueForMultiUser) === 'success')
        {
            if(props.scope.state.isLoadingAddDateMultiUser)
                return;
                
            props.scope.setState({isLoadingAddDateMultiUser: true});

            var url;
            url = Constants.getRoot() + Constants.addDateToMultiUser;

            let usernames = [];
            for(var i = 0; i < props.userData.length; i++)
            {
                if(props.userData[i].isSelected)
                    usernames.push(props.userData[i].username);
            }

            let body = JSON.stringify({
                usernames : usernames,
                date : props.scope.state.dateValueForMultiUser
            });

            try
            {
                let res = await BasePage.CallApiPost(url, body);
                if(res.status === 200)
                {
                    hideAddShowMultiDateDialog();
                    props.scope.setState({isLoadingAddDateMultiUser: false});
                    await props.fetchDataAgain();
                }
                else
                    throw(Constants.postNot200);
            }
            catch(e)
            {
                props.scope.setState({error: e});
                console.log('Error on date for multiple user submit: ' + props.scope.state.error);
                props.scope.setState({isLoadingAddDateMultiUser: false});
            }
            
        }
        else
        {
            alert('Please enter date as yyyy-MM-dd, entered value was: ' + props.scope.state.dateValue);
        }
    }

    function renderDialog()
    {
        return(

            <Dialog
                open={props.scope.state.isShowMultiDateDialog}
                onClose={hideAddShowMultiDateDialog}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    {"Add date for multiple users"}
                </DialogTitle>
                <DialogContent>
                

                    <form style={{display: 'flex',flexWrap: 'wrap'}} noValidate>
                        <TextField
                            id="date"
                            label="New Date"
                            type="date"
                            onChange={handleDateChange}
                            style={{flex:1}}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />
                    </form>
                    <div style={{marginTop:20}}/>

                    <List style={{height: 350, minWidth: 400}} >
                        {props.userData.map(n => (
                            <ListItem
                                key={n.id}
                                //role={undefined}
                                dense
                                button
                                onClick={(event) => props.handleRowClick(event, n.id)}
                                //style={{paddingLeft:20, paddingRight: 20}}
                                >
                                <Checkbox
                                    checked={n.isSelected}
                                    tabIndex={-1}
                                    disableRipple
                                    style={{marginLeft: -35}}
                                />
                                <ListItemText primary={n.name} />
                            </ListItem>
                        ))}
                    </List>

                    

                </DialogContent>
                
                <DialogActions>
                    <Button onClick={hideAddShowMultiDateDialog} color="primary">
                        Cancel
                    </Button>
                    
                    <ButtonWithLoading
                        handleSubmit = {handleAddDateToMultipleUserSubmit}
                        isLoading = {props.scope.state.isLoadingAddDateMultiUser}
                        // TO DO: fix circleIcon prop.
                        circleIcon = {'94%'}
                    />

                </DialogActions>
            </Dialog>
        );
    }

    return(
        <div>
            <Button 
                variant="fab" 
                color="secondary" 
                size="small" 
                aria-label="Add"
                style={{float:'right', marginTop: 20, marginRight: 20, marginBottom:20}}
                onClick = {showAddShowMultiDateDialog}
                >
                <DateRange />
            </Button>
            {props.scope.state.isShowMultiDateDialog ? 
                renderDialog()
                : 
                <div/>
            }
        </div>
    );  
}

export default AddDateForMultiUser;