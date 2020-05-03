import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class MostExpensiveProductinBrand extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="mostexpensiveproductinbrand-input">
				<div className="title">{this.props.title}</div>
				<div className="Description">{this.props.Description}</div>
				<div className="average_rating">{this.props.average_rating}</div>
			</div>
		);
	}
}
