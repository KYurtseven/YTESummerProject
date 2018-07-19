import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import tubitak_logo from '../img/tubitak-logo.jpg';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Cookies from "universal-cookie";
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

class Header extends React.Component
{  
    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
      }


    constructor(props)
    {
        super(props);
        this.state = 
        {
            anchorEl: null, // for menu
        }
        this.handleanchorElClick = this.handleanchorElClick.bind(this);
        this.handleanchorElClose = this.handleanchorElClose.bind(this);
        
        this.handleLogout = this.handleLogout.bind(this);
        this.handleProfile = this.handleProfile.bind(this);
    }

    handleLogout()
    {
        // TO DO
        // If the user keep moved between pages (user/admin)
        // the page is not rendered
        const cookies = new Cookies();
        cookies.remove('userInfo', {path: '/'});
        this.props.history.goBack();
    }

    handleanchorElClick(event)
    {
        this.setState({ anchorEl: event.currentTarget });
    }
    
    handleanchorElClose()
    {
        this.setState({ anchorEl: null });
    }

    handleProfile()
    {
        this.props.history.push('/profile/');
    }

    render()
    {

        return (
            <AppBar /*position="static"*/ style={{backgroundColor: '#ff1744'}} >
                <Toolbar>
                
                <Avatar alt="Tübitak logo" src={tubitak_logo} style={{margin:10,marginLeft: -10}} />
                
                <Typography variant="title" color="inherit"
                    style={{flex : 1, }}>
                    {this.props.name ? this.props.name : 'TÜBİTAK'}
                </Typography>
                <IconButton
                    aria-label="More"
                    aria-owns={this.state.anchorEl ? 'long-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleanchorElClick}
                    >
                    <MoreVertIcon style={{color: 'white'}} />
                </IconButton>

                <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleanchorElClose}
                >
                    <MenuItem onClick={this.handleProfile}>Profile</MenuItem>
                    <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                </Menu>
                </Toolbar>
            </AppBar>
        );
    }
  
}


export default withRouter(Header);