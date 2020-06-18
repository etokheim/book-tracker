import React from 'react';
// import * as BooksAPI from './BooksAPI'
import './App.css';
import Header from './components/Header';
import Bookshelf from './components/Bookshelf';
import * as booksApi from "./BooksAPI";

class BooksApp extends React.Component {
	state = {
		/**
		 * TODO: Instead of using this state variable to keep track of which page
		 * we're on, use the URL in the browser's address bar. This will ensure that
		 * users can use the browser's back and forward buttons to navigate between
		 * pages, as well as provide a good URL they can bookmark and share.
		 */
		showSearchPage: false,
		shelves: []
	}

	componentDidMount = async () => {
		const books = await booksApi.getAll();
		const shelves = [];

		for (let i = 0; i < books.length; i++) {
			const book = books[i];

			// Search for the bookshelf the new book belongs to
			let shelf = shelves.find( (shelf) => shelf.name === book.shelf);

			// If we couldn't find the shelf, create it
			if(!shelf) {
				shelves.push({
					name: book.shelf,
					books: []
				})

				shelf = shelves[shelves.length - 1];
			}

			// Add the book to the shelf
			shelf.books.push(book);
		}

		// Add the shelves to state
		this.setState({
			shelves
		});
	}

	handleMoveBook = (book, newShelf) => {
		const { shelves } = this.state;
		const newBook = book;

		// Map over the shelves to find the book we are moving.
		const filteredShelves = shelves.map( (shelf) => {
			// Filter the books to remove the moved book
			shelf.books = shelf.books.filter( book => book.id !== newBook.id)
			return shelf;
		});

		// Find the shelf we should put the book in by name
		const shelf = shelves.find( shelf => shelf.name === newShelf);

		// Update the new book's knowledge of which shelf it's in
		newBook.shelf = newShelf;

		// Put the book in the new shelf
		shelf.books.push(newBook);

		this.setState({
			shelves: filteredShelves
		})

		// TODO: Move the book on the server side as well
	}

	render() {
		const { shelves } = this.state;
		return (
			<div className="app">
				<Header showSearch={false} />
				{this.state.showSearchPage ? (
					<div className="search-books-results">
						<ol className="books-grid" />
					</div>
				) : (
					<div className="list-books">
						<div className="list-books-content">
							{ shelves.map( (shelf) => (
								<Bookshelf title={ shelf.name } books={ shelf.books } handleMoveBook={ this.handleMoveBook } key={ shelf.name } />
							)) }
						</div>
						<div className="open-search">
							<button onClick={() => this.setState({ showSearchPage: true })}>Add a book</button>
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default BooksApp;
