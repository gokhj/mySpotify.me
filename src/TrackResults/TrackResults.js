import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

class TrackResults extends React.Component {

    render() {
        return (
            <div>
                {
                    this.props.results.map(result => <h5>{result.name}</h5>)
                }
            </div>
        )
    }

}

export default TrackResults