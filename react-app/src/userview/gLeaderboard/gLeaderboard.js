import React,{Component} from 'react';

class GlobLeaderboard extends Component {
    constructor(){
        super();
        this.state = {
            people : []
        }
    }

    componentDidMount() {
        fetch('http://localhost:8080/leaderboard')
            .then(res => res.json())
                .then(data => this.setState({people : data}));
    }

    render(){
        if(!this.state.people.length)
            return(<h1>Loading</h1>)
        let x = this.state.people.map(item=>(
            <tr>
                <td>{item.Username}</td>
                <td>{item.Genre}</td>
                <td>{item.Total}</td>
            </tr>
        ))
        return(
            <div className="div-table">
                <h1>Global Leaderboard </h1>
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <th>Username</th>
                        <th>Genre</th>
                        <th>Total</th>
                    </thead>
                    <tbody>
                        {x}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default GlobLeaderboard;