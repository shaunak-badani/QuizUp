import React, { Component } from 'react';

class GenreStandings extends Component {
    constructor() {
        super();
        this.state = {
            people: [],
            genres: []
        }
    }

    groupBy = function (arr, prop) {
        return arr.reduce(function (groups, item) {
            const val = item[prop]
            groups[val] = groups[val] || []
            groups[val].push(item)
            return groups
        }, {})
    }

    componentDidMount() {
        fetch('http://localhost:8080/quizzes')
            .then(res => res.json())
            .then(data => {
                let x = this.groupBy(data, 'genre')
                this.setState({ genres: Object.keys(x) })
            })
    }

    getGenre = (event) => {
        fetch('http://localhost:8080/genrePoints/' + event.target.value)
            .then(res => res.json())
            .then(data => this.setState({ people : data }));
    }

    render() {
        if (!this.state.genres.length)
            return (<h1>Loading</h1>)
        let x = this.state.genres.map(item => (
            <option key={item}>
                {item}
            </option>
        ))
        return (
            <div className="div-table">
                <h1>Leaderboard across various genres </h1>
                <label htmlFor="genre">Select A Genre:</label>
                <select style={{marginBottom : '3vh' }}className="form-control" onChange={this.getGenre}>
                    {x}
                </select>
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <th>Username</th>
                        <th>Total</th>
                    </thead>
                    <tbody>
                        {this.state.people.map(item => (
                            <tr>
                                <td>{item.Username}</td>
                                <td>{item.Total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default GenreStandings;