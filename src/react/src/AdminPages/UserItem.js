import React, { Component } from 'react';

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
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import DeleteDate from './DeleteDate';
import AddDate from './AddDate';
import UpdateDeposit from './UpdateDeposit';
import * as TablePaginationActions from '../GlobalPages/TablePaginationActions';

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
            page : 0,
            rowsPerPage: 5,
        };

        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleUpdateDepositShow = this.handleUpdateDepositShow.bind(this);

        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    }

    handleChangePage = (event, newpage) => {
        this.setState({page : newpage });
    };

    handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
    };
    

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
            console.log('Error useritem componentwillmount: ' + error);
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
                    {this.state.isUpdateDepositShow ? 
                        <UpdateDeposit
                            userData = {this.props.userData}
                            fetchDataAgain = {this.props.fetchDataAgain}
                            scope = {this}
                        /> 
                        : <div/>
                        }
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

    renderUserDates(isDataAcceptable)
    {
        if(!isDataAcceptable)
        {
            return(
                <Paper style = {{width: '100%', overflowX : 'auto'}} >
                    <Typography style={{marginLeft:12, marginTop:16, fontSize: 15}}>No Late Data</Typography>
                    <AddDate
                        fetchDataAgain = {this.props.fetchDataAgain}
                        userData = {this.props.userData}
                        scope = {this}
                    />
                </Paper>

            );
        }
        var data = this.state.dates;
        const emptyRows = 
            this.state.rowsPerPage - 
            Math.min(this.state.rowsPerPage, data.length -this.state.page * this.state.rowsPerPage);
 
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
                        {data.slice(
                                this.state.page * this.state.rowsPerPage, 
                                this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(n => {
                            return (
                            <TableRow key={n.id} onClick={event => this.handleRowClick(event, n.id)}>
                                <TableCell padding="checkbox" style={{width: 50}} >
                                    <Checkbox checked={n.isSelected} />
                                </TableCell>
                                <TableCell component="th" scope="row">{n.date}</TableCell>
                            </TableRow>
                            );
                        })}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 48 * emptyRows }}>
                            <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                            colSpan={3}
                            count={data.length}
                            rowsPerPage={this.state.rowsPerPage}
                            page={this.state.page}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions.TablePaginationActionsWrapped}
                            />
                        </TableRow>
                    </TableFooter>

                </Table>

                <DeleteDate
                    disabled = {this.state.selectedDateNumber <= 0}
                    fetchDataAgain = {this.props.fetchDataAgain}
                    userData = {this.props.userData}
                    scope = {this}
                /> 

                <AddDate
                    fetchDataAgain = {this.props.fetchDataAgain}
                    userData = {this.props.userData}
                    scope = {this}
                />           
            </Paper>
        );
    }
    
/*
 * OLD BODY
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
*/
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