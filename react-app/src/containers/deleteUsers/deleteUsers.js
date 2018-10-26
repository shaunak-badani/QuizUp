import React,{Component} from 'react';

class DeleteUsers extends Component{
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

    userDeleteHandler = (id) => {
        fetch('http://localhost:8080/deleteUser/'+id,{
            method : 'DELETE'
        })
            .then(res => res.json())
            .then(data => console.log(data)) // -> Making sure no uncaught promises
        let x = this.state.users.filter(user => user.Id !== id);
        this.setState({users:x});
    }

    render()
    {
        let x = (
            this.state.users.map(user => (
                <tr>
                    <td>{user.Id}</td>
                    <td>{user.username}</td>
                    <td>{user.name}</td>
                    <td>
                        <button className="btn btn-danger" onClick={()=>this.userDeleteHandler(user.Id)}>Delete User</button>
                    </td>
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
                            <th>Delete User?</th>
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

export default DeleteUsers;