import React from 'react';
import PageNavbar from './PageNavbar';
import BrandStatsRow from './BrandStatsRow';

import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';



export default class BrandStats extends React.Component {

	constructor(props) {

		super(props);



		// State maintained by this React component is the selected movie name,
		// and the list of recommended movies.
		this.state = {
			brand: "",
			productAttrs: []
		}

		this.handleProductNameChange = this.handleProductNameChange.bind(this);
		this.submitProduct = this.submitProduct.bind(this);
	}

	handleProductNameChange(e) {
		this.setState({
			brand: e.target.value
		});
	}

	/* ---- Q2 (Recommendations) ---- */
	// Hint: Name of movie submitted is contained in `this.state.movieName`.
	submitProduct() {
		// Send an HTTP request to the server.
    fetch("http://localhost:8081/Average rating and price in a brand/"+ this.state.brand,
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
      <BrandStats  aveRating={recObj.aveRating} avePrice={recObj.avePrice} />
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
			    		<div className="h5">Get Brand Stats</div>
			    		<br></br>
			    		<div className="input-container">
			    			<input type='text' placeholder="Enter brand name" value={this.state.brand} onChange={this.handleProductNameChange} id="productName" className="brandstats-input"/>
			    			<button id="submitMovieBtn" className="submit-btn" onClick={this.submitProduct}>Submit</button>
								</div>
								<div className="header-container">
								<div className="h6">
								</div>
									<div className="h6"></div>
									<div className="headers">
			    				<div className="header"><strong>Average rating</strong></div>
			    				<div className="header"><strong>Average price</strong></div>

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
