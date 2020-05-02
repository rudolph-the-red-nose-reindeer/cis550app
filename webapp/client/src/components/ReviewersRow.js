import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ReviewersRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="movieResults">
				<div className="Name">{this.props.Name}</div>
				<div className="numReviews">{this.props.numReviews}</div>
				<div className="avgRating">{this.props.avgRating}</div>
			</div>
		);
	}
}
