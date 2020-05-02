import React from 'react';
import PageNavbar from './PageNavbar';
import ReviewersRow from './ReviewersRow';
import './App.scss';
import Dropdown1 from './Dropdown1';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';

/*eslint no-undef: "error"*/
/*eslint-env node*/



export default class Reviewers extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected movie name,
		// and the list of recommended movies.
		this.state = {
			reviewerName: "",
			ReviewerAttrs: []
		}

		this.handleReviewerChange = this.handleReviewerChange.bind(this);
		this.submitReviewer = this.submitReviewer.bind(this);
	}

	handleReviewerChange(e) {
		this.setState({
			reviewerName: e.target.value
		});
	}

	/* ---- Q2 (Recommendations) ---- */
	// Hint: Name of movie submitted is contained in `this.state.movieName`.
	submitReviewer() {
		// Send an HTTP request to the server.
    fetch("http://localhost:8081/reviewers/"+ this.state.reviewerName,
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
      <ReviewersRow  Name={recObj.Name} numReviews={recObj.numReviews} avgRating={recObj.avgRating} />
      );



      // Set the state of the genres list to the value returned by the HTTP response from the server.
      this.setState({
        ReviewerAttrs: recDivs
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

			    <div className="container recommendations-container">
			    	<div className="jumbotron">
			    		<div className="h5">Reviewer Search</div>
			    		<br></br>
			    		<div className="input-container">
			    			<input type='text' placeholder="Enter Reviewer Name" value={this.state.reviewerName} onChange={this.handleReviewerChange} id="reviewerName" className="reviewer-input"/>
			    			<button id="submitMovieBtn" className="submit-btn" onClick={this.submitReviewer}>Submit</button>
			    		</div>
			    		<div className="header-container">
							<div className="h6">Or <Dropdown1 title="Other Reviewer information" />
							</div>
			    			<div className="h6"></div>
			    			<div className="headers">
			    				<div className="header"><strong>Name</strong></div>
			    				<div className="header"><strong>NumReviews</strong></div>
					            <div className="header"><strong>avgRating</strong></div>

			    			</div>
			    		</div>
			    		<div className="results-container" id="results">
			    			{this.state.ReviewerAttrs}
								</div>
							</div>
						</div>
					</div>

		);
	}
}
