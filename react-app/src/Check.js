import React,{Component,Fragment} from 'react';
import AdminPage from './containers/AdminPage';
import UserPage from './userview/userPage';
import GoogleLogin from 'react-google-login';
import './Check.css';

class Check extends Component{
    constructor(){
        super();
        this.state = {
            "admin" : true,
            loggedIn : false,
            userName : "shaunak",
            password : "",
            login_error : null,
            r_name : "",
            r_password : "",
            r_username : "",
            reg_error : null,
            Login : true
        }
    }

    responseGoogle = (response) => {
        fetch('http://localhost:8080/userAdd',{
            method : 'POST',
            body : JSON.stringify({
                "Username" : response.w3.U3,
                "Name" : response.w3.ig,
                "Password" : "sign-google"
            })
        })
        .then(res=>res.json())
        .then(data => console.log(data));
           
        
        this.setState({username : response.w3.U3,loggedIn : true});
        // localStorage.setI    tem({"username" : response.w3.U3,"loggedIn" : true});
      }

    loginHandler = () => {
        fetch('http://localhost:8080/user',{
            method : 'POST',
            body : JSON.stringify({
                "Username" : this.state.userName,
                "Password" : this.state.password
            })
        })
        .then(res => res.json())
            .then(data => {
                if(data["auth"])
                {
                    this.setState({loggedIn : true});
                    if(this.state.userName === "shaunak")
                        this.setState({admin : true});
                }
                else{
                    this.setState({login_error : "Wrong username or password"})
                }
            })
    }

    registerHandler = () => {
        if(!this.state.r_username || !this.state.r_name || !this.state.r_password)
        {
            this.setState({reg_error : "Username or name or password cannot be null"});
            return;
        }
        fetch('http://localhost:8080/userAdd',{
            method : 'POST',
            body : JSON.stringify({
                "Username" : this.state.r_userName,
                "Name" : this.state.r_name,
                "Password" : this.state.r_password
            })
        })
        .then(res=>res.json())
        .then(data => console.log(data));
        localStorage.setItem({"username" : this.state.r_username});
        this.setState({loggedIn : true});

    }

    logoutHandler = () => {
        console.log("Should log out");    
    }

    render(){
        let loginClasses = [];
        let registerClasses = [];
        if(this.state.Login)
        {
            loginClasses.push('active');
        }
        else
        {
            registerClasses.push('active');
        }
        let userForm = (
            <div className="Form-Login">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" className="form-control" onChange={(event)=>this.setState({userName:event.target.value})} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>                    
                    <input type="password" className="form-control" onChange={(event)=>this.setState({password:event.target.value})} />
                </div>
                <div className="login-btn text-center">
                    <button className="btn btn-success login-btn" onClick={this.loginHandler}>Login!</button>
                </div>
                <p style={{color:'red'}}>{this.state.login_error}</p>
                <GoogleLogin
                    clientId="422290593874-f10kfscjrfdbf2m2jgb4ao1ln4n67hja.apps.googleusercontent.com"
                    buttonText="Login via Google"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                />
            </div>
        );
        if(!this.state.Login)
        {
            userForm = (
                <div className="Form-Login">
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input type="text" className="form-control" onChange={(event)=>this.setState({r_username:event.target.value})} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Name:</label>
                        <input type="text" className="form-control" onChange={(event)=>this.setState({r_name:event.target.value})} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>                    
                        <input type="password" className="form-control" onChange={(event)=>this.setState({r_password:event.target.value})} />
                    </div>
                    <div className="login-btn text-center">
                        <button className="btn btn-success" onClick={this.registerHandler}>Register!</button>
                    </div>
                        <p style={{color:'red'}}>{this.state.reg_error}</p>
                </div>
            );
        }
        if(!this.state.loggedIn)
            return(
            <Fragment>
                <h1>Welcome</h1>
                <div className="Center-Box">
                    <div className="Center-Nav">
                        <div onClick={()=>this.setState({Login : true})} className={loginClasses.join(" ")}><h1>Login</h1></div>
                        <div onClick={()=>this.setState({Login : false})} className={registerClasses.join(" ")}><h1>Register</h1></div>
                    </div>
                    {userForm}
                </div>
                <div className="d-flex justify-content-center">
                </div>
            </Fragment>
            );
        else{
            if(this.state.admin) 
                return(
                    <AdminPage>
                        <button onClick={() => this.logoutHandler()} className="btn btn-danger">Logout</button>                
                    </AdminPage>
                );
            else
                return (
                    <UserPage username={this.state.userName} >
                        <button onClick={() => this.logoutHandler()} className="btn btn-danger">Logout</button>                
                    </UserPage>
                );   
        }
    }
}

export default Check;