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

		/*
			Check if any of the organized books appears in the search results. If they do, we'll tell them which
			shelf they are placed in.
		*/
		// Get all local books
		const books = shelves.map( shelf => shelf.books ).flat();
		
		// For every searchResult, check if it is in the local book array
		// If it is, assign it to the same shelf
		for (let i = 0; i < searchResults.length; i++) {
			const result = searchResults[i];
			
			for (let j = 0; j < books.length; j++) {
				const book = books[j];
				
				if(book.id === result.id) {
					// Assign the searchResult to the same shelf as the local book
					result.shelf = book.shelf
				}
			}
		}


		// Set the state
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
