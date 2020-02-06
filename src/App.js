import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Spotify from './util/Spotify';
import TopResults from './TopResults/TopResults';
import TrackResults from './TrackResults/TrackResults';
import ArtistResults from './ArtistResults/ArtistResults';
import Toggle from 'react-toggle'
import CornerButton from './CornerButton/CornerButton'

class App extends React.Component {

  constructor(props){

    super(props);

    this.state = {
      results: [],
      artistOrTrack: false,
      loggedIn: false
    }

    this.getArtists = this.getArtists.bind(this);
    this.getTracks = this.getTracks.bind(this);
    this.artistOrTrack = this.artistOrTrack.bind(this);
    this.getResults = this.getResults.bind(this);
    this.updateloggedIn = this.updateloggedIn.bind(this);
  }

  artistOrTrack() {
      if (this.state.artistOrTrack) {
        this.setState({ artistOrTrack: false });
      } else {
        this.setState({ artistOrTrack: true });
      }
      this.getResults();
  }

  getArtists() {
    Spotify.getArtists().then(results => {
      this.setState({results: results});
    });
  }

  getTracks() {
    Spotify.getTracks().then(results => {
      this.setState({results: results});
    })
  }

  getResults() {
    if(this.state.artistOrTrack){
      Spotify.getArtists().then(results => {
        this.setState({results: results});
      })
    } else {
      Spotify.getTracks().then(results => {
        this.setState({results: results});
      })
    }
  }

  updateloggedIn(val) {
    console.log(val);
    this.setState({loggedIn: val})
  }

  render(){
    return (
      <div>
        <nav className="navbar darkNavBar">
          <span className="navbar-brand">mySpotify.me</span>
          <CornerButton loggedIn={this.updateloggedIn} />
          {/* <button type="button" className="btn btn-success my-2 my-sm-0" onClick={this.loginSpotify}>Login</button> */}
        </nav>
        <div className="myContainer">
          <div className="container">
            <h5>This app is in development</h5>
            <h6>Check the source code from <a href="https://github.com/gokhj/mySpotify.me" target="_blank" rel="noopener noreferrer">here</a>.</h6>
            <div className="artist-track-toggle">
              <p>Artists &larr; </p>
              <label>
                <Toggle
                  defaultChecked={this.state.artistOrTrack}
                  icons={false}
                  disabled={!this.state.loggedIn}
                  onChange={this.artistOrTrack} />
              </label>
              <p> &rarr; Tracks</p>
            </div>
            {/* <TopResults results={this.state.results}/> */}
            <ArtistResults results={this.state.results}/>
          </div>
        </div>
      </div>
    );
  } 
}

export default App;
