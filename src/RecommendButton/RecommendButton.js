import React from 'react';
import Spotify from '../util/Spotify';
import '../CornerButton/CornerButton.css';

class RecommendButton extends React.Component {

    constructor(props) {
        super(props);

        this.recommend = this.recommend.bind(this);
        
    }

    async recommend() {
        const artists = await Spotify.getArtists(this.props.time, 10);
        const tracks = await Spotify.getTracks(this.props.time, 10);
        let newSongs = await Spotify.getRecommendations(artists, tracks);
        let arrangedValues = [];
        newSongs.tracks.forEach(track => {
            let dict = {
                id: track.id,
                name: track.name,
                image: track.album.images,
                link: track.external_urls.spotify,
                artists: track.artists,
                uri: track.uri
            }
            arrangedValues.push(dict);
        });
        this.props.newSongs(arrangedValues);
    }

    render() {

        let hiddenButton = "btn"
        if (!this.props.time) {
            hiddenButton += " hidden"
        }
        if (this.props.recommended) {
            hiddenButton += " active-button"
        }

        return(
            <button type="button" className={hiddenButton} onClick={this.recommend}>Recommend Me</button>
        )
    }

}

export default RecommendButton;