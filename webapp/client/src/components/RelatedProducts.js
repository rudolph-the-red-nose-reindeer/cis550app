import React from 'react';
import PageNavbar from './PageNavbar';
import RelatedProductsRow from './RelatedProductsRow';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from './Dropdown';



export default class RelatedProducts extends React.Component {

	constructor(props) {

		super(props);



		// State maintained by this React component is the selected movie name,
		// and the list of recommended movies.
		this.state = {
			productNametitle: "",
			productNamerelation:"",
			productAttrs: []
		}

		this.handleProductNameChange0 = this.handleProductNameChange0.bind(this);
			this.handleProductNameChange1 = this.handleProductNameChange1.bind(this);
		this.submitProduct = this.submitProduct.bind(this);
	}

	handleProductNameChange0(e) {
		this.setState({
			productNametitle: e.target.value
		});
	}
	handleProductNameChange1(e) {
		this.setState({
			productNamerelation: e.target.value
		});
	}

	/* ---- Q2 (Recommendations) ---- */
	// Hint: Name of movie submitted is contained in `this.state.movieName`.
	submitProduct() {
		// Send an HTTP request to the server.
    fetch("http://localhost:8081/Get%20related%20products/"+ this.state.productNametitle +"/"+this.state.productNamerelation,
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

      // Map each genreObj in genreList to an HTML element:
      // A button which triggers the showMovies function for each genre.
      let recDivs = recList.map((recObj, i) =>
      	<tr>
			<td>{recObj.TITLE}</td>
			<td>{recObj.DESCRIPTION}</td>
			<td>{recObj.PRICE}</td>
			<td>{recObj.AVERATINGS}</td>
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
				<PageNavbar active="products" />

			    <div className="container products-container">
			    	<div className="jumbotron">
			    		<div className="h5">Search for related products</div>
			    		<br></br>
			    	
								<div className="input-container">
									<input type='text' placeholder="Enter product name" value={this.state.productNametitle} onChange={this.handleProductNameChange0} id="productNametitle" className="relatedproducts-input"/>
									<input type='text' placeholder="Enter product label" value={this.state.productNamerelation} onChange={this.handleProductNameChange1} id="productNamerelation" className="relatedproducts-input"/>
									<button id="submitMovieBtn" className="submit-btn" onClick={this.submitProduct}>Submit</button>
									</div>
									<div class="container">
						<div className="h6">Or <Dropdown title="Other reviewer information" /></div>
						<table class="table table-striped">
							<thead>
							<tr>
								<th>Product Name</th>
								<th>Description</th>
								<th>Price</th>
								<th>Average Ratings</th>
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
///////
