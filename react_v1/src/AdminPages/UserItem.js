import React, { Component } from 'react';
import * as Constants from '../GlobalPages/Constants' ;
import * as BasePage from '../GlobalPages/BasePage';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';

class UserItem extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            whichTab : 'details',
            dates : {},
            selectedDateNumber : 0,
            isDeleteDialogShow: false,
            isAddDateDialogShow : false,
            isUpdateDepositShow: false,
            dateValue : '',
        };

        this.handleTabChange = this.handleTabChange.bind(this);
        
        this.handleDeleteDateDialogShow = this.handleDeleteDateDialogShow.bind(this);
        this.handleDeleteDateDailogHide = this.handleDeleteDateDailogHide.bind(this);
        this.handleDeleteDateSubmit = this.handleDeleteDateSubmit.bind(this);

        this.handleAddDateDialogShow = this.handleAddDateDialogShow.bind(this);
        this.handleAddDateDialogHide = this.handleAddDateDialogHide.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleAddDateSubmit = this.handleAddDateSubmit.bind(this);
    
        this.handleDepositChange = this.handleDepositChange.bind(this);
        this.handleUpdateDepositHide = this.handleUpdateDepositHide.bind(this);
        this.handleUpdateDepositShow = this.handleUpdateDepositShow.bind(this);
        this.handleDepositSubmit = this.handleDepositSubmit.bind(this);

    }

    componentWillMount()
    {
        try
        {
            var myarr = []
            for(var i = 0; i < this.props.userData.dates.length; i++)
            {
                let tmpval = {};
                tmpval.date = this.props.userData.dates[i];
                tmpval.isSelected = false;
                tmpval.id = i;
                myarr.push(tmpval);
            }
            this.setState({dates : myarr});
        }
        catch(error)
        {
            //console.log('Error useritem componentwillmount: ' + error);
        }

    }

    handleRowClick = (event, id) => {
        let tmp = this.state.dates;
        let oldNumber = this.state.selectedDateNumber;

        let selectedIndex;
        for(var i = 0; i < this.state.dates.length; i++)
        {
            if(id === tmp[i].id)
            {
                selectedIndex = i;
                break;
            }
        }
        console.log('selectedIndex: ' + selectedIndex);

        if(tmp[selectedIndex].isSelected)
        {
            tmp[selectedIndex].isSelected =false;
            oldNumber = oldNumber - 1;
        }
        else
        {
            tmp[selectedIndex].isSelected = true;
            oldNumber = oldNumber + 1;
        }
        
        this.setState({ dates: tmp, selectedDateNumber: oldNumber });
    };

    handleTabChange = (event, value) => {
        this.setState({whichTab: value });
    };

    handleUpdateDepositShow()
    {
        this.setState({isUpdateDepositShow: true});
    }

    handleUpdateDepositHide()
    {
        this.setState({isUpdateDepositShow: false});
    }

    handleDepositChange(event)
    {
        this.setState({depositValue: event.target.value});
    }
    

    // post to the database
    async handleDepositSubmit(event)
    {
        if(!isNaN(this.state.depositValue))
        {
            var url;
            url = Constants.getRoot() + Constants.updateDeposit;

            let body = JSON.stringify({
                username : this.props.userData.username,
                deposit : this.state.depositValue
            });
            //BasePage.CallApiPost(url, body).done(() => {});
            
            try
            {
                let res = await BasePage.CallApiPost(url, body);
                if(res.status === 200)
                {
                    await this.props.fetchDataAgain();
                    // this page will be automatically re-rendered
                }
                else
                    throw(Constants.postNot200);
            }
            catch(e)
            {
                this.setState({error: e});
                console.log('Error on deposit submit' + this.state.error);
            }
        }
        else
        {
            alert("Please enter an integer");
        }
    }

    renderUpdateDeposit()
    {
        return(
            <Dialog
                open={this.state.isUpdateDepositShow}
                onClose = {this.handleUpdateDepositHide}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">{"Update Deposit for "}{this.props.userData.username}</DialogTitle>
                <DialogContent>
                    <form style={{display: 'flex',flexWrap: 'wrap',}} noValidate>
                        <TextField
                            id="deposit"
                            label="New Deposit"
                            type="number"
                            onChange={this.handleDepositChange}
                            style={{width: 200}}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleUpdateDepositHide} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleDepositSubmit} color="primary" autoFocus>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    renderUserDetails()
    {
        return(
            <List component="nav">
                <ListItem>
                    <ListItemText 
                        primary = 'Username'
                        secondary = {this.props.userData.username} />
                </ListItem>
                
                <Divider/>
                
                <ListItem>
                    <ListItemText 
                        primary = "Email" 
                        secondary = {this.props.userData.email}/>
                </ListItem>
                
                <Divider/>

                <ListItem>
                    <ListItemText 
                        primary = "Deposit"
                        secondary = {this.props.userData.deposit} />
                    
                    <Tooltip title="Update deposit">
                        <IconButton 
                            aria-label="Add" 
                            style={{float: 'right'}}
                            onClick = {this.handleUpdateDepositShow}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                    {this.state.isUpdateDepositShow ? this.renderUpdateDeposit() : <div/>}
                </ListItem>
                
                <Divider/>
                
                <ListItem >
                    <ListItemText 
                        primary = "User Type"
                        secondary = {this.props.userData.usertype} />
                </ListItem>
            </List>
        );
    }
    
    async handleDeleteDateSubmit(event)
    {
        // we need to send the NOTSELECTED dates to the server
        // to update the server

        var notSelectedDates = [];

        for(var i = 0; i < this.state.dates.length; i++)
        {
            if(!this.state.dates[i].isSelected)
            {
                notSelectedDates.push(
                    this.state.dates[i].date
                );
            }
        }
        
        try
        {
            var url;
            url = Constants.getRoot() + Constants.deleteDates;

            let body = JSON.stringify({
                username : this.props.userData.username,
                dates : notSelectedDates
            });

            let res = await BasePage.CallApiPost(url, body);
            if(res.status === 200)
            {
                await this.props.fetchDataAgain();
                // this page will be automatically re-rendered
            }
            else
                throw(Constants.postNot200);
        }
        catch(e)
        {
            this.setState({error: e});
            console.log('Error on deposit submit' + this.state.error);
        }

    }

    renderDeleteDateButton()
    {

        return(
            <div>

            <Tooltip title="Delete dates">
                <IconButton 
                    aria-label="Delete" 
                    style={{float: 'right'}}
                    onClick = {this.handleDeleteDateDialogShow}>
                    
                    <DeleteIcon />
                </IconButton>
            </Tooltip>

            <Dialog
                open={this.state.isDeleteDialogShow}
                onClose = {this.handleDeleteDateDailogHide}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you want to delete selected dates for {this.props.userData.username}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleDeleteDateDailogHide} color="primary">
                        Disagree
                    </Button>
                    <Button onClick={this.handleDeleteDateSubmit} color="primary" autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>

            </div>
        );
    }

    handleDeleteDateDialogShow()
    {
        console.log('open pressed');
        this.setState({isDeleteDialogShow: true});
    }

    handleDeleteDateDailogHide()
    {
        console.log('hide pressed');
        this.setState({isDeleteDialogShow: false});
        
    }

    handleAddDateDialogShow()
    {
        this.setState({isAddDateDialogShow: true});
    }

    handleAddDateDialogHide()
    {
        this.setState({isAddDateDialogShow: false});
    }
    
    handleDateChange(event)
    {
        console.log('dateValue: ' + event.target.value);
        this.setState({dateValue: event.target.value});
    }

    
    // post to the database
    async handleAddDateSubmit(event)
    {
        if(BasePage.isValidDate(this.state.dateValue) === 'success')
        {
            var url;
            url = Constants.getRoot() + Constants.addDate;

            let body = JSON.stringify({
                username : this.props.userData.username,
                date : this.state.dateValue
            });

            try
            {
                let res = await BasePage.CallApiPost(url, body);
                if(res.status === 200)
                {
                    await this.props.fetchDataAgain();
                }
                else
                    throw(Constants.postNot200);
            }
            catch(e)
            {
                this.setState({error: e});
                console.log('Error on date submit: ' + this.state.error);
            }
        }
        else
        {
            alert('Please enter date as yyyy-MM-dd, entered value was: ' + this.state.dateValue);
        }
    }

    renderAddDateButton()
    {
        return(
            <div>
            <Tooltip title="Add dates">
                <IconButton 
                    aria-label="Add" 
                    style={{float: 'right'}}
                    onClick = {this.handleAddDateDialogShow}>
                    <AddIcon />
                </IconButton>
            </Tooltip>

            <Dialog
                open={this.state.isAddDateDialogShow}
                onClose = {this.handleAddDateDialogHide}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">{"Add a date for "}{this.props.userData.username}</DialogTitle>
                <DialogContent>
                    <form style={{display: 'flex',flexWrap: 'wrap',}} noValidate>
                        <TextField
                            id="date"
                            label="New Date"
                            type="date"
                            onChange={this.handleDateChange}
                            style={{width: 200}}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleAddDateDialogHide} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleAddDateSubmit} color="primary" autoFocus>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            </div>
        );
    }

    renderUserDates(isDataAcceptable)
    {
        if(!isDataAcceptable)
        {
            return(
                <Paper style = {{width: '100%', overflowX : 'auto'}} >
                    <Typography style={{fontSize: 15}}>No Late Data</Typography>
                    {this.renderAddDateButton()}
                </Paper>

            );
        }
        var data = this.state.dates;

        return(
            <Paper style = {{width: '100%', overflowX : 'auto'}} >
                <Table style = {{minWidth : 700}} >
                    <TableHead>
                        <TableRow>
                            <TableCell style={{width: 50}} ></TableCell>
                            <TableCell>
                                <Typography style={{fontSize: 15}}>Dates</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {data.map(n => {
                        return (
                        <TableRow key={n.id} onClick={event => this.handleRowClick(event, n.id)}>
                            <TableCell padding="checkbox" style={{width: 50}} >
                                <Checkbox checked={n.isSelected} />
                            </TableCell>
                            <TableCell component="th" scope="row">{n.date}</TableCell>
                        </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
                {this.state.selectedDateNumber > 0 ? this.renderDeleteDateButton() : <div/>}
                
                {this.renderAddDateButton()}

            </Paper>
        );
    }

    render()
    {
        var isDataAcceptable = true;
        if(this.props.userData.dates === null || this.props.userData.dates === undefined)
            isDataAcceptable = false;

        return(
            <div style= {{width: '100%'}}>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography style={{fontSize: 15}}>{this.props.userData.name}</Typography>
                    </ExpansionPanelSummary>
                    
                    <ExpansionPanelDetails>
                    
                    <AppBar position="static" color="default">
                        <Tabs
                        value={this.state.whichTab}
                        indicatorColor="secondary"
                        textColor="secondary"
                        onChange={this.handleTabChange}
                        >
                            <Tab value="details" label="Details" style ={{}} />
                            <Tab value="dates" label="Dates" />
                        </Tabs>
                        {this.state.whichTab === 'details' ? this.renderUserDetails() : this.renderUserDates(isDataAcceptable)}
                    </AppBar>

                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <Divider light />
            </div>
        );
    }
}

export default UserItem;