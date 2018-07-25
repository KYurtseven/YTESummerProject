import React from 'react';
import * as Constants from '../GlobalPages/Constants' ;
import * as BasePage from '../GlobalPages/BasePage';


import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';


const AddUser = (props) =>
{   

    function handleEmailChange(event)
    {
        props.scope.setState({newUserEmail : event.target.value});
    }
    
    function handleUsernameChange(event)
    {
        props.scope.setState({newUserUsername: event.target.value});
    }

    function handlePasswordChange(event)
    {
        props.scope.setState({newUserPassword: event.target.value});
    }

    function handleNameChange(event)
    {
        props.scope.setState({newUserName: event.target.value});
    }


    function checkValidity()
    {
        if(props.scope.state.newUserUsername.length >= 5)
        {
            if(BasePage.validateEmail(props.scope.state.newUserEmail) === 'success')
            {
                if(props.scope.state.newUserPassword.length >= 5)
                {
                    return true;
                }
            }
        }
        return false;
    }

    function hideDialog()
    {
        props.scope.setState({isShowUserDialog: false});
    }
    

    async function handleAddUserSubmit()
    {
        if(checkValidity())
        {
            try
            {
                var url;
                url = Constants.getRoot() + Constants.addUser;

                let body = JSON.stringify({
                    username : props.scope.state.newUserUsername,
                    email : props.scope.state.newUserEmail,
                    password : props.scope.state.newUserPassword,
                    name : props.scope.state.newUserName,
                    groupid : props.scope.state.userInfo.groupid
                });
                let res = await BasePage.CallApiPost(url, body);
               
                if(res.status === 200)
                {
                    let restext = await res.text();
                    let resJSON = JSON.parse(restext);
                    if(resJSON.error !== '')
                        throw(resJSON.error);

                    hideDialog();
                    await props.fetchDataAgain();
                    //this page will be automatically re-rendered
                }
                else
                    throw(Constants.postNot200);
            }
            catch(e)
            {
                props.scope.setState({error: e});
                console.log('Error on adduser submit' + props.scope.state.error);
            }
        }
        else
        {
            alert("Check fields");
        }
    }

    function showAddUserDialog()
    {
        props.scope.setState({isShowUserDialog: true});
    }

    function renderDialog()
    {
        return(
            <Dialog
            open={props.scope.state.isShowUserDialog}
            onClose = {hideDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">{"Add user"}</DialogTitle>
            <DialogContent>
                <form style={{display: 'flex',flexWrap: 'wrap',}} noValidate>
                    <TextField
                        id="username"
                        label="Username"
                        type="text"
                        onChange={handleUsernameChange}
                        style={{width: 200}}
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                </form>

                <Divider light />

                <form style={{display: 'flex',flexWrap: 'wrap',}} noValidate>
                    <TextField
                        id="email"
                        label="Email"
                        type="email"
                        onChange={handleEmailChange}
                        style={{width: 200}}
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                </form>

                <Divider light />
                
                <form style={{display: 'flex',flexWrap: 'wrap',}} noValidate>
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        onChange={handlePasswordChange}
                        style={{width: 200}}
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                </form>
                
                <Divider light />

                <form style={{display: 'flex',flexWrap: 'wrap',}} noValidate>
                    <TextField
                        id="name"
                        label="Name"
                        type="text"
                        onChange={handleNameChange}
                        style={{width: 200}}
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                </form>

            </DialogContent>
                <DialogActions>
                    <Button onClick={hideDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddUserSubmit} color="secondary" autoFocus>
                        Submit
                    </Button>
                </DialogActions>
                {props.scope.state.error}
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
                onClick = {showAddUserDialog}
                >
                <AddIcon />
            </Button>
            {props.scope.state.isShowUserDialog ? 
                renderDialog()
                : 
                <div/>
            }
        </div>
    );   
}

export default AddUser;