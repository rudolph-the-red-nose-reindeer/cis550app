import React from 'react';
import PageNavbar from './PageNavbar';
import TopReviewersRow from './TopReviewersRow';

import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';



export default class TopReviewers extends React.Component {

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
    fetch("http://localhost:8081/Get%20top%20reviewers/"+ this.state.productName,
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
      <TopReviewers  Name={recObj.Name} numReviews={recObj.numReviews} />
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
			<div className="Reviewers">
				<PageNavbar active="reviewers" />

			    <div className="container products-container">
			    	<div className="jumbotron">
			    		<div className="h5">Top Reviewers</div>
			    		<br></br>
			    		<div className="input-container">
			    			<input type='text' placeholder="" value={this.state.productName} onChange={this.handleProductNameChange} id="productName" className="topreviewers-input"/>
			    			<button id="submitMovieBtn" className="submit-btn" onClick={this.submitProduct}>Submit</button>
								</div>
								<div className="header-container">
								<div className="h6">
								</div>
									<div className="h6"></div>
									<div className="headers">
			    				<div className="header"><strong>reviewer name</strong></div>
			    				<div className="header"><strong>number of reviews written</strong></div>

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
