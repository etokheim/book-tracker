import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Book extends Component {
	state = {
		shelf: this.props.book.shelf
	}

	static propTypes = {
		book: PropTypes.object.isRequired,
		handleMoveBook: PropTypes.func.isRequired
	}

	handleMoveBookLocal = (event) => {
		const { book, handleMoveBook } = this.props;
		const shelf = event.target.value;

		this.setState({
			shelf
		})

		handleMoveBook(book, shelf);
	}

	render() {
		const { book, shelf } = this.props;
		return (
			<li>
				<div className="book">
					<div className="book-top">
						<div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url("${book.imageLinks ? book.imageLinks.thumbnail : ''}")` }} />
						<div className="book-shelf-changer">
							<select onChange={ this.handleMoveBookLocal } value={ shelf }>
								<option value="move" disabled>Move to...</option>
								<option value="currentlyReading">Currently Reading</option>
								<option value="wantToRead">Want to Read</option>
								<option value="read">Read</option>
								<option value="none">None</option>
							</select>
						</div>
					</div>
					<div className="book-title">{ book.title }</div>
					<div className="book-authors">{ book.authors.map( (author, index) => {
						// Format multiple authors (separate with commas and "and")
						if(index > 0 && index + 1 === book.authors.length) {
							// If last author (and not the first), then prepend "and"
							return ` and ${author}`
						} else if(index > 0) {
							// If not first, nor last author, prepend a comma
							return `, ${author}`;
						} else {
							// Else, just return the author
							return author
						}
					}) }</div>
				</div>
			</li>
		)
	}
}
