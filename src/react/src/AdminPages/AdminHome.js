import React, { Component } from 'react';
import '../GlobalPages/Home.css';
import * as Constants from '../GlobalPages/Constants' ;
import * as BasePage from '../GlobalPages/BasePage';
import UserItem from './UserItem';
import 'typeface-roboto';
import Cookies from "universal-cookie";
import Header from '../GlobalPages/Header';

import { withRouter } from 'react-router';

import AddUser from './AddUser';
import AddDateForMultiUser from './AddDateForMultiUser';
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

            // states for adding date to multiple users
            isShowMultiDateDialog: false,
            dateValueForMultiUser: '',
            userDataForMultiDate: {},
            
            // newuser
            newUserEmail: '',
            newUserUsername : '',
            newUserPassword: '',
            newUserName: '',

            error: ''
        }
   }

    sortByKey(array, key)
    {
        return array.sort(function(a,b){
            var x = a[key].toLowerCase(); var y = b[key].toLowerCase();
            return((x < y) ? -1: ((x > y) ? 1 : 0));
        });
    }


    prepareDataForAddDateForMultiUser()
    {
        // FOR ADD DATE FOR MULTI USER
        var data = []
        for(var i = 0; i < this.state.userData.length; i++)
        {
            let tmpval = {};
            tmpval.username = this.state.userData[i].username;
            tmpval.name = this.state.userData[i].name;
            tmpval.isSelected = false;
            tmpval.id = i;
            data.push(tmpval);
        }
        this.setState({userDataForMultiDate : data});
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

                        this.prepareDataForAddDateForMultiUser();
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

    handleRowClickForAddDateForMultiUser(event ,id)
    {
        let tmp = this.state.userDataForMultiDate;
        let selectedIndex;
        for(var i = 0; i < this.state.userDataForMultiDate.length; i++)
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
        }
        else
        {
            tmp[selectedIndex].isSelected = true;
        }
        
        this.setState({ userDataForMultiDate: tmp});
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
                    
                    <AddUser
                        scope = {this}
                        fetchDataAgain = {this.fetchDataAgain.bind(this)}  
                    />

                    <AddDateForMultiUser
                        scope = {this}
                        userData = {this.state.userDataForMultiDate}
                        handleRowClick = {this.handleRowClickForAddDateForMultiUser.bind(this)}
                        fetchDataAgain = {this.fetchDataAgain.bind(this)}

                    />
              </div>
            );
        }
    }
}

export default withRouter(AdminHome);