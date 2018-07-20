import React, { Component } from 'react';
import '../GlobalPages/Home.css';
import * as Constants from '../GlobalPages/Constants' ;
import * as BasePage from '../GlobalPages/BasePage';
import UserItem from './UserItem';
import 'typeface-roboto';
import Cookies from "universal-cookie";
import Header from '../GlobalPages/Header';

import { withRouter } from 'react-router';

import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';

import AddUser from './AddUser';

class AdminHome extends Component
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
            groupname: '',
            isShowUserDialog: false,

            // newuser
            newUserEmail: '',
            newUserUsername : '',
            newUserPassword: '',
            newUserName: '',

            error: ''
        }

        this.showAddUserDialog = this.showAddUserDialog.bind(this);
   }

    sortByKey(array, key)
    {
        return array.sort(function(a,b){
            var x = a[key].toLowerCase(); var y = b[key].toLowerCase();
            return((x < y) ? -1: ((x > y) ? 1 : 0));
        });
    }

    async componentDidMount()
    {
        if(Constants.IS_MOCK)
        {
            var tmp = Constants.MOCK_ADMIN_OBJ;
            this.setState({userData: tmp.users, groupname: tmp.groupname, isLoading: false});
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
                url = Constants.getRoot() + Constants.adminFetch + cookies.get('userInfo').groupid;
                
                try
                {
                    let res = await BasePage.CallApiGet(url);
                    if(res.status === 200)
                    {
                        let restext = await res.text();
                        let resJSON = JSON.parse(restext);
                        
                        let users = resJSON.users;
                        users = this.sortByKey(users, 'name');
                        this.setState({userData: users, groupname: resJSON.groupname, isLoading: false});
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

    async fetchDataAgain()
    {
        await this.componentDidMount();
    }

    renderIsLoading()
    {
        return (
            <div className="App">
                <p> Not rendered yet </p>
            </div>
            );
    }

    showAddUserDialog()
    {
        this.setState({isShowUserDialog: true});
    }

    render()
    {
        if(this.state.isLoading)
            return (this.renderIsLoading());
        else
        {
            var renderCassandra = []
            for(let i = 0; i < this.state.userData.length; i++)
            {
                renderCassandra.push(
                    <UserItem
                        key = {i}
                        userData = {this.state.userData[i]}
                        fetchDataAgain = {this.fetchDataAgain.bind(this)}
                    />
                );
            }
            return(
                <div>
                    <Header name = {this.state.groupname}/>
                    
                    <div style={{marginTop: 100}}/>
                    
                    {renderCassandra}
                    
                    <Button 
                        variant="fab" 
                        color="secondary" 
                        size="small" 
                        aria-label="Add"
                        style={{float:'right', marginTop: 20, marginRight: 20}}
                        onClick = {this.showAddUserDialog}
                        >
                        
                        <AddIcon />
                    </Button>
                    {this.state.isShowUserDialog ? 
                        <AddUser
                            scope = {this}
                            fetchDataAgain = {this.fetchDataAgain}  
                        />
                        : 
                        <div/>
                    }
              </div>
            );
        }
    }
}

export default withRouter(AdminHome);