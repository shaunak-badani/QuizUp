import React,{Component} from 'react';

class ViewUsers extends Component{
    constructor(){
        super();
        this.state = {
            users : []
        }
    }

    componentDidMount(){
        fetch('http://localhost:8080/users')
            .then(res=>res.json())
            .then(data => this.setState({users : data}))
    }

    render()
    {
        let x = (
            this.state.users.map(user => (
                <tr>
                    <td>{user.Id}</td>
                    <td>{user.username}</td>
                    <td>{user.name}</td>
                </tr>
            ))
        )
        return(
            <div className="div-table ">
                <table className="table table-striped">
                    <thead class="thead-dark">
                        <tr>
                            <th>User Id </th>
                            <th>Username </th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {x}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ViewUsers;