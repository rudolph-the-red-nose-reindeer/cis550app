import React from 'react';
import PageNavbar from './PageNavbar';
import RecommendationsRow from './RecommendationsRow';
import './App.scss';
import Dropdown from './Dropdown';
//import ProductsRows from './ProductsRows';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';



export default class Products extends React.Component {

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
    fetch("http://localhost:8081/products/"+ this.state.productName,
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
      <RecommendationsRow  asin={recObj.asin} title={recObj.title} description={recObj.description} price={recObj.price} brand={recObj.brand}/>
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
			    		<div className="h5">Product search</div>
			    		<br></br>
			    		<div className="input-container">
			    			<input type='text' placeholder="Enter product name" value={this.state.productName} onChange={this.handleProductNameChange} id="productName" className="product-input"/>
			    			<button id="submitMovieBtn" className="submit-btn" onClick={this.submitProduct}>Submit</button>
			    		</div>
			    		<div className="header-container">
			    		<div className="h6">Or <Dropdown title="Other product information" />
							</div>
								<div className="h6"></div>
			    			<div className="headers">
			    				<div className="header"><strong>asin</strong></div>
			    				<div className="header"><strong>title</strong></div>
					            <div className="header"><strong>description</strong></div>
					            <div className="header"><strong>price</strong></div>
											<div className="header"><strong>brand</strong></div>
			    			</div>
			    		</div>
			    		<div className="results-container" id="results">
			    			{this.state.productAttrs}
								</div>
							</div>
						</div>
					</div>

		);
	}
}
