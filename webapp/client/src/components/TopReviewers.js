import React from 'react';
import PageNavbar from './PageNavbar';
import Dropdown1 from './Dropdown1';
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

		
	}

	handleProductNameChange(e) {
		this.setState({
			productName: e.target.value
		});
	}

	/* ---- Q2 (Recommendations) ---- */
	// Hint: Name of movie submitted is contained in `this.state.movieName`.
	componentDidMount() {
		// Send an HTTP request to the server.
    fetch("http://localhost:8081/Get%20top%20reviewers",
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
			<td>{recObj.NAME}</td>
			<td>{recObj.NUMREVIEWS}</td>
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
			<div className="Reviewers">
				<PageNavbar active="reviewers" />

			    <div className="container products-container">
			    	<div className="jumbotron">
			    		<div className="h5">Top Reviewers</div>
			    		<br></br>
			    		<div class="container">
						<div className="h6">Or <Dropdown1 title="Other reviewer information" /></div>
						<table class="table table-striped">
							<thead>
							<tr>
								<th>Name</th>
								<th>Number of Reviews</th>
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
