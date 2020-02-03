import React from 'react'

class TopResults extends React.Component {

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

export default TopResults