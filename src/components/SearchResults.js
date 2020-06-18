import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class SearchResults extends Component {
	static propTypes = {
		toggleSearch: PropTypes.func.isRequired
	}

	componentDidMount() {
		this.props.toggleSearch(true);
	}
	
	componentWillUnmount() {
		this.props.toggleSearch(false);
	}

	render() {
		return (
			<div className="search-books-results">
				<ol className="books-grid" />
			</div>
		)
	}
}
