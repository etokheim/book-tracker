import React from 'react';
import { Route, Link } from "react-router-dom";
import './App.css';
import Header from './components/Header';
import Bookshelf from './components/Bookshelf';
import * as booksApi from "./BooksAPI";

class BooksApp extends React.Component {
	state = {
		shelves: []
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

	handleMoveBook = (book, newShelfId) => {
		const { shelves } = this.state;
		const newBook = book;

		// Map over the shelves to find the book we are moving.
		const filteredShelves = shelves.map( (shelf) => {
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
			shelves: filteredShelves
		})

		// TODO: Move the book on the server side as well
	}

	render() {
		const { shelves } = this.state;
		return (
			<div className="app">
				<Header showSearch={false} />
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
					<div className="search-books-results">
						<ol className="books-grid" />
					</div>
				)} />
			</div>
		);
	}
}

export default BooksApp;
