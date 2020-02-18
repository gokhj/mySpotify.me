import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Spotify from './util/Spotify';
import Results from './Results/Results';
import Toggle from 'react-toggle';
import CornerButton from './CornerButton/CornerButton';

class App extends React.Component {

  constructor(props){

    super(props);

    this.state = {
      results: [], // json result coming from Spotify API
      artistOrTrack: false, // toggle button
      loggedIn: false, // check if loggedIn
      time_range: "" // the time range for getTracks and getArtists functions
    }

    // binding all the functions
    this.artistOrTrack = this.artistOrTrack.bind(this);
    this.getResults = this.getResults.bind(this);
    this.updateloggedIn = this.updateloggedIn.bind(this);
    this.changeTimeline = this.changeTimeline.bind(this);
    this.checkShortTerm = this.checkShortTerm.bind(this);
    this.checkMediumTerm = this.checkMediumTerm.bind(this);
    this.checkLongTerm = this.checkLongTerm.bind(this);

    const cookie = Spotify.checkExists();
    if(cookie) {
      this.state.loggedIn = true;
    }
    // If the url contains access token, then reload to login
    // This solution is temporary, I don't like it personally but it just works at the moment
    if(Spotify.assignAccessToken()){
      window.location.reload();
    }

  }
  // deciding logic for the toggle
  artistOrTrack() {
      if (this.state.artistOrTrack) {
        this.setState({ artistOrTrack: false });
      } else {
        this.setState({ artistOrTrack: true });
      }
      this.getResults(this.state.time_range, this.state.artistOrTrack);
  }
  // checking results depending on the toggle's value and time range. default time_range is long_term
  getResults(time_range, artistOrTrack) {
    if(artistOrTrack){
      Spotify.getArtists(time_range).then(results => {
        this.setState({results: results});
      })
    } else {
      Spotify.getTracks(time_range).then(results => {
        this.setState({results: results});
      })
    }
  }
  // receiving informatin from CornerButton component
  updateloggedIn(val) {
    this.setState({loggedIn: val})
  }
  // make separate API call to get time_range
  changeTimeline(time_range) {
    this.setState({time_range: time_range});
    this.getResults(time_range, !this.state.artistOrTrack);
  }
  // 1 month
  checkShortTerm() {
    this.changeTimeline('short_term');
  }
  // 6 months
  checkMediumTerm() {
    this.changeTimeline('medium_term');
  }
  // Account lifetime
  checkLongTerm() {
    this.changeTimeline('long_term');
  }

  render(){
    return (
      <div>
        <nav className="navbar darkNavBar">
          <span className="navbar-brand">mySpotify.me</span>
          <CornerButton loggedIn={this.updateloggedIn} cookieLoginData={this.state.loggedIn}/>
        </nav>
        <div className="myContainer">
          <div className="container">
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
            <br></br>
            <div className="buttons">
              <button className="btn" onClick={this.checkShortTerm} disabled={!this.state.loggedIn}>1 month</button>
              <button className="btn" onClick={this.checkMediumTerm} disabled={!this.state.loggedIn}>6 months</button>
              <button className="btn" onClick={this.checkLongTerm} disabled={!this.state.loggedIn}>Lifetime</button>
            </div>
          </div>
          <Results results={this.state.results} />
        </div>
      </div>
    );
  } 
}

export default App;
