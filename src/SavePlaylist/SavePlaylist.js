import React from 'react';
import Spotify from '../util/Spotify';
import './SavePlaylist.css';

class SavePlaylist extends React.Component {

    constructor(props){
        super(props);

        this.savePlaylist = this.savePlaylist.bind(this);
        this.createTrackUris = this.createTrackUris.bind(this);
    }

    savePlaylist() {
        if(this.props.artistOrTrack || this.props.recommended) {
            const trackUris = this.createTrackUris();
            Spotify.savePlaylist(trackUris, this.props.time, this.props.recommended);
        }
    }

    createTrackUris() {
        let trackUris = [];
        this.props.trackUris.forEach(element => {
            trackUris.push(element.uri);
        });
        return trackUris;
    }

    render() {
        let hiddenButton = "btn"
        if(!this.props.artistOrTrack) {
            hiddenButton += " hidden"
        }
        if(this.props.recommended) {
            hiddenButton = "btn";
        }

        return(
            <button type="button" onClick={this.savePlaylist} className={hiddenButton}>Save as a Playlist</button>
        )
    }

}

export default SavePlaylist;