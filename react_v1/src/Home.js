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
                    <EssayForm/>
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
    }
}

const UserItem = (props) => 
{
    var lateDates = [];
    
    if(props.userInfo.dates == null || props.userInfo.dates == undefined)
        return(
            <div className = "User-div-container">
                <div className = "User-div-left">
                    <p className= "User-text-left">username: {props.userInfo.username}</p>
                    <p className= "User-text-left">email: {props.userInfo.email}</p>
                    <p className= "User-text-left">name: {props.userInfo.name}</p>
                    <p className= "User-text-left">deposit: {props.userInfo.deposit}</p>
                    <p className= "User-text-left">userType: {props.userInfo.usertype}</p>
                </div>
                <div className="User-div-right">
                    <p className= "User-text-right">No Late Data</p>
                    <input type="submit" value="Submit" />
                </div>
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
        <div className= "User-div-container">
            <div className = "User-div-left" >
                <p className= "User-text-left">username: {props.userInfo.username}</p>
                <p className= "User-text-left">email: {props.userInfo.email}</p>
                <p className= "User-text-left">name: {props.userInfo.name}</p>
                <p className= "User-text-left">deposit: {props.userInfo.deposit}</p>
                <p className= "User-text-left">userType: {props.userInfo.usertype}</p>
            </div>
            <div className = "User-div-right">
                {lateDates}
                <form>
                    <label>
                        Name:
                    <input type="text" name="name" />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        </div>
    );
}

const LateDates = (props) =>
{
    return(
        <li className= "User-text-right">{props.date}</li>
    );
}

class EssayForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        value: 'Please write an essay about your favorite DOM element.'
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      alert('An essay was submitted: ' + this.state.value);
      event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Essay:
            <textarea value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }

export default Home;