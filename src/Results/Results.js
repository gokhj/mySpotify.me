import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Results.css';

class Results extends React.Component {

    constructor(props) {
        super(props);

        this.arrangeGenres = this.arrangeGenres.bind();
        this.arrangeImages = this.arrangeImages.bind();

    }
    // arrange genres // creating dictionary is finished so far
    arrangeGenres(artists) {

        let totalGenres = {}

        artists.forEach(element => {
            const elementGenres = element.genres;
            if(elementGenres) {
                elementGenres.forEach(genre => {
                    if(totalGenres.hasOwnProperty(genre)){
                        totalGenres[genre] += 1;
                    } else {
                    totalGenres[genre] = 1;
                    }
                });
            } else {
                return false;
            }
        });

        if (Object.keys(totalGenres).length === 0) {
            return false;
        } else {
            return totalGenres;
        }

    }
    // arranging images // moved from render method for readability
    arrangeImages(arr) {

        let new_results = []
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            try {
                let image = element.image[0].url
                let obj = {
                    name: element.name,
                    image: image,
                    link: element.link
                }
                new_results.push(obj);
            } catch {
                let obj = {
                    name: element.name,
                    image: 'https://www.friendlyfoodqatar.com/mt-content/uploads/2017/04/no-image.jpg',
                    link: element.link,
                }
                new_results.push(obj);
            }

        }

        return new_results;
    }

    render() {
        const data = this.props.results;
        const new_results = this.arrangeImages(data);
        const genres = this.arrangeGenres(data);
        if(genres) {
            new_results.push(genres);
        }

        return (
            <div className="mainResultDiv">
                {
                    new_results.map(result =>

                        <div className="card myCard">
                            <a href={result.link} target="_blank" rel="noopener noreferrer">
                                <img src={result.image} className="card-img-top" alt="..." />
                                <div className="card-body">
                                    <p className="card-text">{result.name}</p>
                                </div>
                            </a>
                        </div>

                    )
                }
            </div>
        )
    }

}

export default Results;