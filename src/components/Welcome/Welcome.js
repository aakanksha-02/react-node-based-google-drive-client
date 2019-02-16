import React, {Component} from 'react';
import GoogleLogin from 'react-google-login';
import {PostData} from '../../services/PostData';
import {Redirect} from 'react-router-dom';
import './Welcome.css';

class Welcome extends Component {
  constructor(props){
    super(props);
    this.state ={
      loginError: false,
      redirect: false 
    };
    this.signup = this.signup.bind(this);
  }

  signup(res, type){
    let postData;
    if(type === 'google' && res.w3.U3){
      postData = {newUser:true, name: res.w3.ig, provider: type, email:res.w3.U3 , provider_id:res.El, token:res.Zi.access_token , provider_pic:res.w3.Paa };
      // Storing user data in session storage after successful login
      sessionStorage.setItem("userData", JSON.stringify(postData));
      console.log(sessionStorage.getItem('userData'));
    }

    if(postData){
      PostData('signup', postData).then((result) =>{
        this.setState({redirect: true});
      });
    }
    else{
      console.log("Uh-oh");
    }
  }

  render() {

    if(this.state.redirect || sessionStorage.getItem('userData')){
      // console.log(this.state.redirect);
      // If resdirect values is true or userdata is available in browser session, no need to login again. 
      // Redirect to - http://localhost:3000/home
      return (<Redirect to={'/home'}/>)
    }
    const responseGoogle = (response) => {
      console.log(response);
      this.signup(response, 'google');
    }
    return (
      <div className="row body">
        <div className="medium-12 columns">
          <div className="medium-12 columns">
            <h2 id="welcomeText"></h2>
              <GoogleLogin
                clientId="986936472556-re5pk41emtkdtdtnmobh0gqt7vk8fgvr.apps.googleusercontent.com"
                buttonText="Login with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
              />
          </div>
        </div>
      </div>
    );
  }
}

export default Welcome;