import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class TopReviewsByReviewerRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="topreviewsbyreviewer-input">
				<div className="productName">{this.props.productName}</div>
				<div className="rating">{this.props.rating}</div>
				<div className="review">{this.props.review}</div>
				<div className="time">{this.props.time}</div>
			</div>
		);
	}
}
