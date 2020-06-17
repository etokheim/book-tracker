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
				console.log("Couldn't find shelf, creating new for", book.shelf);
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
								<Bookshelf title={ shelf.name } books={ shelf.books } />
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
