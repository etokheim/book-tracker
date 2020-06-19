import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as booksApi from "../BooksAPI";
import Book from "./Book";

export default class SearchResults extends Component {
	state = {
		searchResults: []
	}
	static propTypes = {
		toggleSearch: PropTypes.func.isRequired,
		registerSearchInputHook: PropTypes.func.isRequired,
		unregisterSearchInputHook: PropTypes.func.isRequired,
		handleMoveBook: PropTypes.func.isRequired,
		shelves: PropTypes.array.isRequired
	}

	componentDidMount() {
		this.props.toggleSearch(true);
		this.props.registerSearchInputHook(this.handleSearchInput);
	}
	
	componentWillUnmount() {
		this.props.toggleSearch(false);
		this.props.unregisterSearchInputHook(this.handleSearchInput);
	}

	handleSearchInput = async (query) => {
		const { shelves } = this.props;
		let searchResults = await booksApi.search(query);

		// The API returns nothing when it receives an empty query...
		if(!searchResults) {
			console.error("Something went wrong with the API. It returned nothing.");
			searchResults = [];
		}

		// Handle server errors
		// Note: the server responds with an "Empty query" error when it gets no hits.
		if(searchResults.error) {
			console.error(`Server responded with error: ${searchResults.error}`);
			searchResults = [];
		}

		// Check if any of the organized books appears in the search results. If they do, we'll tell them which
		// shelf they are placed in.
		const books = shelves.map( shelf => shelf.books ).flat();
		
		// We get every book using the map function, and the utilize the find function to find matches, as
		// find stops looping after the first match.
		books.map( book => searchResults.find(searchResult => {
			if(searchResult.id === book.id) {
				searchResult.shelf = book.shelf;
			}
			return searchResult;
		}))
		
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
