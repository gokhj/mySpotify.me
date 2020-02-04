import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Spotify from '../util/Spotify';

class CornerButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false
        }

        this.loginSpotify = this.loginSpotify.bind(this);

    }

    loginSpotify() {
        this.setState({ loggedIn: true })
        Spotify.getAccessToken();
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
                <div>
                    <p>Already logged in!</p>
                </div>
            )
        }
    }

}

export default CornerButton