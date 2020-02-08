import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Results.css';

class Results extends React.Component {

    render() {
        let new_results = []
        for (let index = 0; index < this.props.results.length; index++) {
            const element = this.props.results[index];
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
        return (
            <div>
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

export default Results