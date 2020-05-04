import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ReviewerTimeRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="reviewertime-input">
				<div className="Name">{this.props.Name}</div>
				<div className="totalTime">{this.props.totalTime}</div>

			</div>
		);
	}
}
