import React, { Component } from 'react'
import PropTypes, { string } from 'prop-types'
import Book from "./Book"

export default class Bookshelf extends Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
		books: PropTypes.array
	}

	render() {
		return (
			<div className="bookshelf">
				<h2 className="bookshelf-title">{ this.props.title }</h2>
				<div className="bookshelf-books">
					<ol className="books-grid">
						<Book handleMoveBook={ (to) => console.log(`User want to move this book to ${ to }`)} book={{}} />
					</ol>
				</div>
			</div>
		)
	}
}
