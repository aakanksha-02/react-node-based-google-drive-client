import React, {Component} from 'react';
import Popup from "reactjs-popup";

class Home extends Component {

	constructor(props){
		super(props);
		this.state={
			redirectReferrer: false,
			name: '',
			email:'foo',
			gdData:[]
		}
	}

	componentDidMount(){
		var user = JSON.parse(sessionStorage.getItem('userData'));
		if(user['newUser']){
			this.addUserToDatabase();
			this.authenticateAppToAccessDrive();
			user['newUser'] = false;
			sessionStorage.setItem('userData', JSON.stringify(user));
		}
		this.getUsersDetails();
		if(this.state.gdData)
			this.getListOfGDItems();
	}

	getListOfGDItems = _ =>{
		let movies = [];
		fetch(`http://localhost:4000/searching?search=${this.state.query}&email=${this.state.email}`)
		.then(response => response.json())
        .then(data => {
            this.setState({ gdData: data })
	    })
	}

	// Sending data to server(on port - 4000) to store login details 
	addUserToDatabase = _ =>{
		console.log("adding user to the database");
		var data = JSON.parse(sessionStorage.getItem('userData'));
		this.state.email = data['email']
		fetch(`http://localhost:4000/adduser?name=${data['name']}&email=${data['email']}&provider=${data['provider']}&provider_id=${data['provider_id']}&provider_pic=${data['provider_pic']}&token=${data['token']}`)
		.then(response => response.json())
		.then(({data}) => {
		})
		.catch(err=>console.error(err))
	}

	getUsersDetails = _ =>{
		console.log("calling the backend /users url with auth token->")
		this.token = JSON.parse(sessionStorage.getItem('userData'))['token']
		console.log(this.token)
		fetch('http://localhost:4000/users')
		.then(response => response.json())
		.then(({data}) => {
			console.log(data)
		})
		.catch(err=>console.error(err))
	}

	authenticateAppToAccessDrive = _ =>{
		if (sessionStorage.getItem('userData')){
			fetch('http://localhost:4000/authenticate')
			.then(response => response.json())
			.then(({data}) => {
				console.log(data)
			})
			.catch(err=>console.error(err))
		}
	}

	render() {
	    return (

	    	<div className="row small-up-2 medium-up-3 large-up-4" id="Body">
        		<div className="medium-12 columns">
					<h2>Welcome</h2>
					<h4>{JSON.parse(sessionStorage.getItem('userData'))['name']}</h4>
					<div>
          				<input type="text" placeholder="Provide token and press Enter..."onChange={event => {this.setState({query: event.target.value})}}
	    						onKeyPress={event => {
	                			if (event.key === 'Enter') {
	                  				this.getListOfGDItems()
	                			}
              				}}
						/>
					</div>
        		</div>
	    	<ul>{this.state.gdData.map(item => <MyAppChild key={item.id} email={this.state.email}  name={item.name} id={item.id} />)}</ul>
			</div>
	    	)
	  }
}


class MyAppChild extends Component {
	constructor(props){
		super(props);
		this.state={
			visible: false,
        	value: ''
		}
	}
  	deleteOneItemFromGD = (id) =>{
		fetch(`http://localhost:4000/delete?id=${id}&email=${this.props.email}`)
		.then(response => response.json())
        .then(data => {
        	alert(JSON.stringify(data))
	    })
	    //window.location.reload()
	}

  render() {
    return (
    	<div>
	    	<li>{this.props.id + " -> " +this.props.name}  
		    	<form onSubmit = {this.handleSubmit}>
		    	
			    <input value='delete' type='button' onClick={this.deleteOneItemFromGD.bind(this, this.props.id)}/>
		    	</form>
	    	</li>
	    </div>
    	)
  }
}

export default Home;