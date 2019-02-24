import React, {Component} from 'react';
import '../App.css';

class ListOfFiles extends Component {
	// constructor(props){
	// 	super(props);
	// 	// this.state={
	// 	// 	visible: false,
  //   //     	value: ''
	// 	// }
	// }
	
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
					<table>
					<tbody>
					<tr>
						<td>
							<a href={this.props.view}>
							<img src={this.props.thumbnail} width="100" height="100" alt={this.props.name}/>
							</a>
						</td>
						<td>
							{this.props.name}
						</td>
						<td>
							<input value='delete' type='button' onClick={this.deleteOneItemFromGD.bind(this, this.props.id)}/>
						</td>
						<td>
							<a href={this.props.download}> Download </a>
						</td>
					</tr>
					</tbody>
					</table>
		    </form>
	    </div>
    )
	}
}

export default ListOfFiles;