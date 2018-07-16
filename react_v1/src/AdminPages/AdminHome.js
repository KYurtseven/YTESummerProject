import React, { Component } from 'react';
import tubitak_logo from '../img/tubitak-logo.jpg';
import './Home.css';
import * as Constants from '../GlobalPages/Constants' ;
import * as BasePage from '../GlobalPages/BasePage';
import UserItem from './UserItem';
import 'typeface-roboto';
import Cookies from "universal-cookie";

class AdminHome extends Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            // initially load the data
            isLoading: true,
            userData : {},
            userInfo : {},
            groupname: '',
            error: ''
        }
    }

    sortByKey(array, key)
    {
        return array.sort(function(a,b){
            var x = a[key]; var y = b[key];
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

            this.setState({userInfo : cookies.get('userInfo')})
            
            url = Constants.getRoot() + Constants.adminFetch + cookies.get('userInfo').groupid;
            
            try
            {
                let res = await BasePage.CallApiGet(url);
                if(res.status === 200)
                {
                    let restext = await res.text();
                    let resJSON = JSON.parse(restext);
                    
                    let users = resJSON.users;
                    users = this.sortByKey(users, 'username');
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
    }

    async fetchDataAgain()
    {
        await this.componentDidMount();
    }


    render()
    {
        if(this.state.isLoading)
        {
            return (
                <div className="App">
                    <p> Not rendered yet </p>
                </div>
                );
        }
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
                        isOdd = {i}
                    />
                );
            }
            return(
                <div className="App">
                    <header className="App-header">
                        <img src={tubitak_logo} className = "App-logo" alt =''/>
                        <h1 className = "App-title">TÜBİTAK</h1>
                    </header>

                    <div style={{marginTop: 20}}/>
                    
                    <div> <h1> {this.state.groupname} </h1> </div>
                    <div style= {{margin: 20}}>
                        <div className="divTable Table">
                            <div className="divTableHeading">
                                <div className="divTableRow">
                                    <div className="divTableHead" style={{width: 50}} ></div>
                                    <div className="divTableHead">User name</div>
                                    <div className="divTableHead">Name</div>
                                    <div className="divTableHead">E-mail</div>
                                    <div className="divTableHead" style = {{width:100}} >Deposit</div>
                                    <div className="divTableHead">User type</div>
                                </div>
                            </div>
                                
                            {renderCassandra}
                        
                        </div>
                    </div>
              </div>
            );
        }
    }
}



export default AdminHome;