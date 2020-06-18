import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Book from "./Book"

export default class Bookshelf extends Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
		books: PropTypes.array,
		handleMoveBook: PropTypes.func.isRequired
	}

	render() {
		const { books, handleMoveBook } = this.props;
		return (
			<div className="bookshelf">
				<h2 className="bookshelf-title">{ this.props.title }</h2>
				<div className="bookshelf-books">
					<ol className="books-grid">
						{ books.map( (book) => (
							<Book handleMoveBook={ handleMoveBook } book={ book } key={ book.id } />
						)) }
					</ol>
				</div>
			</div>
		)
	}
}
