import React, { Component } from 'react';
import tubitak_logo from './img/tubitak-logo.jpg';
import './App.css';
import * as Constants from './Constants' ;
import * as BasePage from './BasePage';

class Home extends Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            isLoading: true,
            userData : {}
        }
    }

    async componentDidMount()
    {
        if(Constants.IS_MOCK)
        {
            var url;
            url = Constants.getRoot() + Constants.exampleURL;

            let res = await BasePage.CallApiGet(url);
            let restext = await res.text();

            this.setState({isLoading: false, userData: JSON.parse(restext)});
            
        }
        else
        {
            // TO DO
        }
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
                console.log(this.state.userData[i].username)
                renderCassandra.push(
                    <UserItem
                        key = {i}
                        userInfo = {this.state.userData[i]}/>
                );
            }

            return(
                <div className="App">
                    <header className="App-header" style ={styles.headerstyle}>
                        <img src={tubitak_logo} style = {styles.tubitak_logo} alt =''/>
                        <h1 className = "App-title" style = {styles.tubitak_header_text}> TÜBİTAK </h1>
                    </header>
                    {renderCassandra}
                </div>
            );
        }
    }
}
const styles = 
{
    tubitak_logo:
    {
        float: 'left',
        height : 75,
        width : 75,
    },
    tubitak_header_text:
    {
        fontSize: 40,
        float: 'center',
    },
    headerstyle:
    {
        backgroundColor : 'red',
        height: 100
    },
    userDiv:
    {
        textAlign: 'center'
    },
    userNameId:
    {
        marginTop: 50,
        float: 'left',
        marginLeft: 20,
        fontSize: 16
    }
}

const UserItem = (props) => 
{
    var lateDates = [];
    
    if(props.userInfo.dates == null || props.userInfo.dates == undefined)
        return(
            <div className = "User-div-left">
                <p>username: {props.userInfo.username}</p>
                <p>email: {props.userInfo.email}</p>
                <p>name: {props.userInfo.name}</p>
                <p>deposit: {props.userInfo.deposit}</p>
                <p>userType: {props.userInfo.usertype}</p>
            </div>
        );

    for(var i = 0; i < props.userInfo.dates.length; i++)
    {
        lateDates.push(
            <LateDates 
                key = {i}
                date = {props.userInfo.dates[i]}/>
        );
    }
    return(
        <div>
            <div className = "User-div-left" >
                <p>username: {props.userInfo.username}</p>
                <p>email: {props.userInfo.email}</p>
                <p>name: {props.userInfo.name}</p>
                <p>deposit: {props.userInfo.deposit}</p>
                <p>userType: {props.userInfo.usertype}</p>
            </div>
            <div className = "User-div-right">
                {lateDates}
            </div>
        </div>
    );
}

const LateDates = (props) =>
{
    return(
        <li>{props.date}</li>
    );
}

export default Home;