import React, {Component} from 'react';
import axios, {get, post} from 'axios';

// import './Home.css';

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
		this.setState({email : user['email']})
		console.log(JSON.parse(sessionStorage.getItem('userData')))
		console.log(this.state.email)
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
		var email = JSON.parse(sessionStorage.getItem('userData'))['email']
		fetch(`http://localhost:4000/searching?successCode=${this.state.successCode}&email=${email}`)
		.then(response => response.json())
        .then(data => {
            this.setState({ gdData: data['files'] })
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
		var email = JSON.parse(sessionStorage.getItem('userData'))['email']
		if (sessionStorage.getItem('userData')){
			fetch(`http://localhost:4000/authenticate?email=${email}`)
			.then(response => response.json())
			.then(({data}) => {
				console.log(data)
			})
			.catch(err=>console.error(err))
		}
	}

	onChange = (e) => {
		var email = JSON.parse(sessionStorage.getItem('userData'))['email']
		let files = e.target.files;
		let fileName = files[0]['name']
		let fileType = files[0]['type']
		let reader = new FileReader();
		var remove = 'data:'+fileType+';base64,';
		reader.readAsDataURL(files[0]);	
		
		reader.onload = (event) => {
			var data = event.target.result.replace(remove, '')
			data = data.replace(' ', '+')
			const url = "http://localhost:4000/upload"
			const formData = {file:data, name:fileName, type:fileType, email:email}
			return post(url, formData)
			.then(response=>{
				console.log(response)
				alert("File uploaded successfully..")
				window.location.reload()
			});
		}
	}

//className="medium-12 columns"
	render() {
	  return (
			<div className="row small-up-2 medium-up-3 large-up-4" id="Body">
					<h2>Welcome {JSON.parse(sessionStorage.getItem('userData'))['name']}... </h2>
					<div>
          	<input type="text" 
          		placeholder="Search..."
          		onChange={event => {this.setState({successCode: event.target.value})}}
	    				onKeyPress={event => {
	              if (event.key === 'Enter') {
	                this.getListOfGDItems()
	              }
              }}
						/>
						<h1> Upload file to Google Drive </h1>
	    			<input type="file" name="file" onChange={(e)=>this.onChange(e)}/>
						<h4>Bellow is list of your 10 files...</h4>
	    			<ul>
		    			{this.state.gdData.map(item => 
		    				<MyAppChild 
		    					key={item.id} 
		    					email={this.state.email}  
		    					name={item.name} 
		    					id={item.id} 
		    					download={item.webContentLink} 
		    					view={item.webViewLink} 
		    					thumbnail={item.thumbnailLink} 
		    				/>
		    			)}
	    			</ul>
					</div>
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
        	window.location.reload();
	    })
	}

  render() {
    return (
    	<div>
		    <form onSubmit = {this.handleSubmit}>
	    	<ul>
		    <a href={this.props.view}>
		    <img src={this.props.thumbnail} width="100" height="100"/>
		    </a>
		    	{this.props.name}
			    <input value='delete' type='button' onClick={this.deleteOneItemFromGD.bind(this, this.props.id)}/>
			    <a href={this.props.download}> Download </a>
	    	</ul>
		    	</form>
	    </div>
    	)
  }
}

export default Home;