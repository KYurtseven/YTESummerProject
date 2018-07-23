import React from 'react';
import * as Constants from '../GlobalPages/Constants';
import * as BasePage from '../GlobalPages/BasePage';
import '../GlobalPages/Home.css';
import Header from '../GlobalPages/Header';
import Cookies from "universal-cookie";

import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
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
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Card from '@material-ui/core/Card';
import * as TablePaginationActions from '../GlobalPages/TablePaginationActions';

class UserHome extends React.Component
{   

    constructor(props)
    {
        super(props);
        this.state = 
        {
            // initially load the data
            isLoading: true,
            userData : {}, // api response
            userInfo : {}, // cookie
            error: '',
            whichTab : 'details',
            page : 0,
            rowsPerPage: 5,
        }
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);

    }

    handleChangePage = (event, newpage) => {
        this.setState({page : newpage });
    };

    handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
    };

    async componentDidMount()
    {
        if(Constants.IS_MOCK)
        {
            var tmp = Constants.MOCK_USER_OBJ;

            this.setState({isLoading: false, userData: tmp});
        }
        else
        {
            this.setState({isLoading: true});
            var url;
            const cookies = new Cookies();
            let userInfo = cookies.get('userInfo');
            this.setState({userInfo : userInfo});
            
            if(userInfo)
            {
                url = Constants.getRoot() + Constants.userFetch + cookies.get('userInfo').username;
            
                try
                {
                    let res = await BasePage.CallApiGet(url);
                    if(res.status === 200)
                    {
                        let restext = await res.text();
                        let resJSON = JSON.parse(restext);
                        
                        this.setState({isLoading: false, userData: resJSON});
                    }
                    else
                        throw(Constants.getNot200);
                }
                catch(e)
                {
                    this.setState({error: e});
                    console.log('Error on fetching data: ' + e);
                }
            }
            else
            {
                // probably cookie is corrupted
                console.log('no cookie is present');
                this.setState({isLoading: true});
            }
        }
    }

    handleTabChange = (event, value) => {
        this.setState({whichTab: value });
    };

    renderIsLoading()
    {
        return (
            <div className="App">
                <p> Not rendered yet </p>
            </div>
            );
    }

    renderUserDetails()
    {
        return(
            <List component="nav">
                <ListItem>
                    <ListItemText 
                        primary = 'Username'
                        secondary = {this.state.userData.username} />
                </ListItem>
                
                <Divider/>
                
                <ListItem>
                    <ListItemText 
                        primary = "Email" 
                        secondary = {this.state.userData.email}/>
                </ListItem>
                
                <Divider/>

                <ListItem>
                    <ListItemText 
                        primary = "Deposit"
                        secondary = {this.state.userData.deposit} />
                </ListItem>
                
                <Divider/>
                
                <ListItem >
                    <ListItemText 
                        primary = "User Type"
                        secondary = {this.state.userData.usertype} />
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
                    <Typography style={{fontSize: 15}}>No Late Data</Typography>
                </Paper>

            );
        }
        var data = [];
        for(var i = 0; i < this.state.userData.dates.length; i++)
        {
            let dataitem = {};
            dataitem.id = i;
            dataitem.date = this.state.userData.dates[i];
            data.push(dataitem);
        }
        const emptyRows = 
            this.state.rowsPerPage - 
            Math.min(this.state.rowsPerPage, data.length -this.state.page * this.state.rowsPerPage);
 
        return(
            <Paper style = {{width: '100%', overflowX : 'auto'}} >
                <Table style = {{minWidth : 700}} >
                    <TableHead>
                        <TableRow>
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
                            <TableRow key={n.id}>
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
            </Paper>
        );
    }

    render()
    {
        if(this.state.isLoading)
            return (this.renderIsLoading());
        // isDataAcceptable is used for
        // when the data has no dates
        // it is a way to run away from an exception
        var isDataAcceptable = true;
        if(this.state.userData.dates === null || this.state.userData.dates === undefined)
            isDataAcceptable = false;

        return(
            <div style= {{width: '100%'}}>
                <Header name = {'TÜBİTAK'}/>
                
                <div style={{marginTop: 100}}/>

                <Card style={{minWidth:500}} >
                    <Typography style={{marginLeft:12, marginTop:16, marginBottom: 16, fontSize: 20}}>
                        {this.state.userData.name}
                    </Typography>
                    
       
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

                </Card>
            </div>
        );
        
    }
}

export default UserHome;