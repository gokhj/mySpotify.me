import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './ArtistResults.css';

class ArtistResults extends React.Component {

    render() {
        return (
            <div>
                {
                    this.props.results.map(result => 

                        <div className="card myCard">
                            <img src={result.image} className="card-img-top" alt="..."/>
                                <div className="card-body">
                                    <p className="card-text">{result.name}</p>
                                </div>
                        </div>
                    
                    )
                }
            </div>
        )
    }

}

export default ArtistResults