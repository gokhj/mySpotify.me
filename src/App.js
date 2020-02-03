import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Spotify from './util/Spotify';
import TopResults from './TopResults/TopResults';

class App extends React.Component {

  constructor(props){

    super(props);

    this.state = {
      results: []
    }

    this.getArtists = this.getArtists.bind(this);
    this.getTracks = this.getTracks.bind(this);

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


  render(){
    return (
      <div>
        <nav className="navbar darkNavBar">
          <span className="navbar-brand myBrand">mySpotify.me</span>
        </nav>
        <div className="myContainer">
          <div className="container">
            <h1>In development React App</h1>
            <button type="button" className="btn btn-success myBtn" onClick={this.getArtists}>Get Top Artists</button>
            <button type="button" className="btn btn-success myBtn" onClick={this.getTracks}>Get Top Tracks</button>
            <TopResults results={this.state.results}/>
          </div>
        </div>
      </div>
    );
  } 
}

export default App;
