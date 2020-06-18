import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class SearchResults extends Component {
	static propTypes = {
		toggleSearch: PropTypes.func.isRequired
	}

	componentDidMount() {
		this.props.toggleSearch(true);
		this.props.registerSearchInputHook(this.handleSearchInput);
	}
	
	componentWillUnmount() {
		this.props.toggleSearch(false);
	}

	handleSearchInput = (input) => {
		console.log(input);
	}

	render() {
		const { searchQuery } = this.props;
		return (
			<div className="search-books-results">
				<span>{ searchQuery }</span>
				<ol className="books-grid" />
			</div>
		)
	}
}
