import React from 'react';
import PageNavbar from './PageNavbar';
import ProductStatsRow from './ProductStatsRow';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';



export default class ProductStats extends React.Component {

	constructor(props) {

		super(props);



		// State maintained by this React component is the selected movie name,
		// and the list of recommended movies.
		this.state = {
			productName: "",
			productAttrs: []
		}

		this.handleProductNameChange = this.handleProductNameChange.bind(this);
		this.submitProduct = this.submitProduct.bind(this);
	}

	handleProductNameChange(e) {
		this.setState({
			productName: e.target.value
		});
	}

	/* ---- Q2 (Recommendations) ---- */
	// Hint: Name of movie submitted is contained in `this.state.movieName`.
	submitProduct() {
		// Send an HTTP request to the server.


		//CHANGE THIS
    fetch("http://localhost:8081/Product%20stats/"+ this.state.productName,
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(recList => {
	  
	  if (!recList) return;
	  console.log(recList);
	  

      // Map each genreObj in genreList to an HTML element:
      // A button which triggers the showMovies function for each genre.
      let recDivs = recList.map((recObj, i) =>
		<tr>
			<td>{recObj.NUMREVIEWS}</td>
			<td>{recObj.RATING}</td>
	  	</tr>      
	  );



      // Set the state of the genres list to the value returned by the HTTP response from the server.
      this.setState({
        productAttrs: recDivs
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
	}


	render() {

		return (
			<div className="Products">
				<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"></link>
  				<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  				<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

				<PageNavbar active="products" />

			    <div className="container products-container">
			    	<div className="jumbotron">
			    		<div className="h5">Product Stats</div>
			    		<br></br>
			    		<div className="input-container">
			    			<input type='text' placeholder="Enter Product name" value={this.state.productName} onChange={this.handleProductNameChange} id="productName" className="productstats-input"/>
			    			<button id="submitMovieBtn" className="submit-btn" onClick={this.submitProduct}>Submit</button>
			    		</div>
						<div class="container">
						<table class="table table-striped">
							<thead>
							<tr>
								<th>Number of Reviews</th>
								<th>Rating</th>
							</tr>
							</thead>
							<tbody>
								{this.state.productAttrs}
							</tbody>
						</table>
			    		</div>
							</div>
						</div>
					</div>
		);
	}
}
