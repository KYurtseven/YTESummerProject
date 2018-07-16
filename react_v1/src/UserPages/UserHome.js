import React from 'react';
import * as Constants from '../GlobalPages/Constants';
import * as BasePage from '../GlobalPages/BasePage';
import tubitak_logo from '../img/tubitak-logo.jpg';

import Cookies from "universal-cookie";
import {
    Button
} from 'react-bootstrap';


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
            isShowDateTab: false,
        }

        this.toggleDateTab = this.toggleDateTab.bind(this);
    }

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

            this.setState({userInfo : cookies.get('userInfo')})
            
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
    }

    toggleDateTab()
    {
        this.setState({isShowDateTab: !this.state.isShowDateTab});
    }

    renderNoLateData()
    {
        return(
            <div>
                <p className= "User-text-right">No Late Data</p>
            </div>
        );
    }

    renderLateDates(lateDates)
    {
        return(
            <div className="divTableBody">
                {lateDates}
            </div>
        );
    }

    renderSubTable(isDataAcceptable, lateDates)
    {
        return(
            <div className="divTableRow" style={{backgroundColor : 'white'}} >
                <div className="divTableCell"></div>
                <div className="divTableCell">

                    <div className="divTable Table" >
                        <div className="divTableHeading">
                            <div className="divTableRow">
                                <div className="divTableHead">Dates</div>
                            </div>
                        </div>
                        {isDataAcceptable ? this.renderLateDates(lateDates) : this.renderNoLateData()}
                    </div>
                </div>
                <div className="divTableCell"></div>
                <div className="divTableCell"></div>
                <div className="divTableCell"></div>
                <div className="divTableCell"></div>
            </div>
        );
    }

    renderIsLoading()
    {
        return (
            <div className="App">
                <p> Not rendered yet </p>
            </div>
            );
    }
    render()
    {
        if(this.state.isLoading)
            return (this.renderIsLoading());
        var lateDates = [];
        // isDataAcceptable is used for
        // when the data has no dates
        // it is a way to run away from an exception
        var isDataAcceptable = true;
        if(this.state.userData.dates === null || this.state.userData.dates === undefined)
            isDataAcceptable = false;
    
        for(var i = 0; isDataAcceptable && i < this.state.userData.dates.length; i++)
        {
            lateDates.push(
                <LateDates 
                    key = {i}
                    date = {this.state.userData.dates[i]}/>
            );
        }

        return(
            <div className="App">
                <header className="App-header">
                    <img src={tubitak_logo} className = "App-logo" alt =''/>
                    <h1 className = "App-title">TÜBİTAK</h1>
                </header>

                <div style={{marginTop: 20}}/>
                    
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
                            
                        <div className="divTableBody">
                
                            <div className="divTableRow" style={{background: ('#F5F5F5')}} >
                                <div className="divTableCell">
                                    <Button bsStyle = "primary" bsSize = 'sm' onClick = {this.toggleDateTab}>
                                        +
                                    </Button>
                                </div>
                                <div className="divTableCell">{this.state.userData.username}</div>
                                <div className="divTableCell">{this.state.userData.name}</div>
                                <div className="divTableCell">{this.state.userData.email}</div>
                                <div className="divTableCell">{this.state.userData.deposit}</div>
                                <div className="divTableCell">{this.state.userData.usertype}</div>
                            </div>
                                {this.state.isShowDateTab ? this.renderSubTable(isDataAcceptable, lateDates) : <div></div>}
                        </div>
                    
                    </div>
                </div>
            </div>
        );
    }
}

const LateDates = (props) =>
{
    return(
        <div className="divTableRow" style = {{}} > 
            <div className="divTableCell">{props.date}</div>
        </div>
    );
}

export default UserHome;