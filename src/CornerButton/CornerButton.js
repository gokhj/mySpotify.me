import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Spotify from '../util/Spotify';
import './CornerButton.css'

class CornerButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false,
            username: []
        }

        this.loginSpotify = this.loginSpotify.bind(this);
        this.getId = this.getId.bind(this);

    }

    loginSpotify() {
        this.setState({ loggedIn: true })
        Spotify.getAccessToken();
        this.getId();
        this.props.loggedIn(true);
    }

    async getId() {
        if(!this.state.loggedIn){
            const token = Spotify.getAccessToken();
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const json = await response.json();
            this.setState({username: [json.id, json.images[0].url]});
        }
    }

    render() {
        if(!this.state.loggedIn){
            return (
                <div>
                    <button type="button" className="btn btn-success my-2 my-sm-0" onClick={this.loginSpotify}>Login</button>
                </div>
            )
        } else {
            return(
                <div className="loggedIn">
                    <img src={this.state.username[1]} className="roundedImage" alt="profile picture"></img>
                    <p className="username">{this.state.username[0]}</p>
                </div>
            )
        }
    }

}

export default CornerButton