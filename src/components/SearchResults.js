import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as booksApi from "../BooksAPI";
import Book from "./Book";

export default class SearchResults extends Component {
	state = {
		searchResults: []
	}

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

	handleSearchInput = async (query) => {
		const searchResults = await booksApi.search(query);

		// The API returns nothing when it receives an empty query...
		if(!searchResults) {
			console.error("Something went wrong with the API. It returned nothing.");
			return;
		}

		// Handle server errors
		// Note: the server responds with an "Empty query" error when it gets no hits.
		if(searchResults.error) {
			console.error(`Server responded with error: ${searchResults.error}`);
			searchResults = [];
		}

		this.setState({
			searchResults
		})
	}

	render() {
		const { searchResults } = this.state;
		const { handleMoveBook } = this.props;
		return (
			<div className="search-books-results">
				{searchResults.map( book => (
					<Book handleMoveBook={ handleMoveBook } book={ book } key={ book.id } />
				))}
			</div>
		)
	}
}
