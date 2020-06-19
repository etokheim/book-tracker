import React from 'react';
import { Route, Link } from "react-router-dom";
import './App.css';
import Header from './components/Header';
import Bookshelf from './components/Bookshelf';
import SearchResults from './components/SearchResults';
import * as booksApi from "./BooksAPI";

class BooksApp extends React.Component {
	state = {
		shelves: [],
		showSearch: false,
		searchInputHooks: []
	}

	componentDidMount = async () => {
		const books = await booksApi.getAll();

		// As there is no way to get the shelves from the API, we must hard code them
		const shelves = [{
			id: "currentlyReading",
			name: "Currently Reading",
			books: []
		}, {
			id: "wantToRead",
			name: "Want to read",
			books: []
		}, {
			id: "read",
			name: "Read",
			books: []
		}];

		for (let i = 0; i < books.length; i++) {
			const book = books[i];

			// Search for the bookshelf the new book belongs to
			let shelf = shelves.find( (shelf) => shelf.id === book.shelf);

			// Add the book to the shelf
			shelf.books.push(book);
		}

		// Add the shelves to state
		this.setState({
			shelves
		});
	}

	handleMoveBook = async (book, newShelfId, undoDueToError) => {
		const { shelves } = this.state;
		const newBook = book;
		const oldShelf = book.shelf;

		// Map over the shelves to find the book we are moving.
		const updatedShelves = shelves.map( (shelf) => {
			// Filter the books to remove the moved book
			shelf.books = shelf.books.filter( book => book.id !== newBook.id)
			return shelf;
		});

		// Find the shelf we should put the book in by id
		const shelf = shelves.find( shelf => shelf.id === newShelfId);

		// Update the new book's knowledge of which shelf it's in
		newBook.shelf = newShelfId;

		// Put the book in the new shelf
		if(newShelfId !== "none") {
			shelf.books.push(newBook);
		}

		this.setState({
			shelves: updatedShelves
		})

		// If undo is true, it means this book failed to be moved on the server side, therefor
		// there is no reason to move it back, as it's already there.
		if(!undoDueToError) {
			// Move the book on the server side as well
			const update = await booksApi.update(newBook, newShelfId);
	
			// Handle any errors
			if(update.error) {
				console.error(update.error);
	
				// Move the book back in order to stay in sync with the server
				this.handleMoveBook(newBook, oldShelf, true);
			}
		}
	}

	toggleSearch = (newState) => {
		this.setState({
			showSearch: newState || !this.state.showSearch
		})
	}

	/*
		Registers a new function which wants to be triggered when the header receives input.
		We want to do it this way, because it lets us transform the header into a search header
		without replacing or overlaying it. This gives us extra flexibility if we want to
		animate it.
	*/
	registerSearchInputHook = (hook) => {
		const hooks = this.state.searchInputHooks;
		hooks.push(hook);

		this.setState({
			searchInputHooks: hooks
		})
	}

	unregisterSearchInputHook = (hookToRemove) => {
		const hooks = this.state.searchInputHooks;
		const newHooks = hooks.filter( hook => hook !== hookToRemove );

		this.setState({
			searchInputHooks: newHooks
		})
	}

	render() {
		const { shelves, showSearch, searchQuery, searchInputHooks } = this.state;
		return (
			<div className="app">
				<Header showSearch={ showSearch } handleSearchInput={ this.handleSearchInput } searchInputHooks={ searchInputHooks } />
				<Route exact path="/" render={() => (
					<div className="list-books">
						<div className="list-books-content">
							{ shelves.map( (shelf) => (
								<Bookshelf title={ shelf.name } books={ shelf.books } handleMoveBook={ this.handleMoveBook } key={ shelf.id } />
							)) }
						</div>
						<div className="open-search">
							<Link to="/search">
								<button>Add a book</button>
							</Link>
						</div>
					</div>
				)} />

				<Route path="/search" render={() => (
					<SearchResults searchQuery={ searchQuery } toggleSearch={ this.toggleSearch } registerSearchInputHook={ this.registerSearchInputHook } unregisterSearchInputHook={ this.unregisterSearchInputHook } handleMoveBook={ this.handleMoveBook } shelves={ shelves } />
				)} />
			</div>
		);
	}
}

export default BooksApp;
