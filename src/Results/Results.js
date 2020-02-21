import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Results.css';

class Results extends React.Component {

    checkType(data) {

        try {
            const genres = data[0].genres;
            if(genres){
                return this.renderArtists(data);
            } else {
                return this.renderTracks(data);
            }
        } catch {
            return this.renderArtists(data);
        }

        

    }

    renderArtists(data) {

        let new_results = []
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            const number = index + 1;
            let additional = ""
            let genres = element.genres.slice(0,3);
            genres.forEach(genre => {
                additional += genre + " ";
            });
            try {
                let image = element.image[0].url
                let obj = {
                    name: element.name,
                    image: image,
                    link: element.link,
                    number: number,
                    additional: additional
                }
                new_results.push(obj);
            } catch {
                let obj = {
                    name: element.name,
                    image: 'https://www.friendlyfoodqatar.com/mt-content/uploads/2017/04/no-image.jpg',
                    link: element.link,
                    number: number,
                    additional: additional
                }
                new_results.push(obj);
            }

        }

        return new_results;

    }

    renderTracks(data) {

        let new_results = []
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            const number = index + 1;
            let additional = "";
            const artistInfo = element.artists;
            if(artistInfo.length > 1) {
                artistInfo.forEach(artist => {
                    additional += artist.name + " & ";
                });
                additional = additional.substring(0, additional.length-3);
            } else {
                artistInfo.forEach(artist => {
                    additional += artist.name;
                });
            }
            try {
                let image = element.image[0].url
                let obj = {
                    name: element.name,
                    image: image,
                    link: element.link,
                    number: number,
                    additional: additional
                }
                new_results.push(obj);
            } catch {
                let obj = {
                    name: element.name,
                    image: 'https://www.friendlyfoodqatar.com/mt-content/uploads/2017/04/no-image.jpg',
                    link: element.link,
                    number: number,
                    additional: additional
                }
                new_results.push(obj);
            }

        }
        
        return new_results;

    }

    render() {
        
        const new_results = this.checkType(this.props.results);

        return (
            <div className="mainResultDiv">
                {
                    new_results.map(result =>

                        <div className="result">

                            <div className="card">
                                <div className="row no-gutters">
                                    <div className="result-image">
                                        <img src={result.image} className="card-img" alt="result"></img>
                                    </div>
                                        <div className="card-body">
                                            <a href={result.link} target="_blank" rel="noopener noreferrer">
                                                <h6 className="card-title">{result.name}</h6>
                                                <p className="card-text">{result.additional}</p>
                                            </a>
                                        <h6 className="result-number">{result.number}</h6>
                                        </div>
                                </div>
                            </div>
                        </div>

                    )
                }
                <div className="message">
                    <p>This app is in development. Check the source code from <a href="https://github.com/gokhj/mySpotify.me" target="_blank"
                        rel="noopener noreferrer">here</a>.</p>
                </div>
            </div>
        )
    }

}

export default Results