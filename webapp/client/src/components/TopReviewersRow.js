import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class TopReviewersRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="topreviewers-input">
				<div className="Name">{this.props.Name}</div>
				<div className="numReviews">{this.props.numReviews}</div>

			</div>
		);
	}
}
