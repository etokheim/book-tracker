import React, { Component } from 'react'
import PropTypes, { string } from 'prop-types'
import Book from "./Book"

export default class Bookshelf extends Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
		books: PropTypes.array
	}

	render() {
		const { books } = this.props;
		return (
			<div className="bookshelf">
				<h2 className="bookshelf-title">{ this.props.title }</h2>
				<div className="bookshelf-books">
					<ol className="books-grid">
						{ books.map( (book) => (
							<Book handleMoveBook={ (to) => console.log(`User want to move this book to ${ to }`)} book={ book } key={ book.id } />
						)) }
					</ol>
				</div>
			</div>
		)
	}
}
