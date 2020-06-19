import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

export default class Header extends Component {
	static propTypes = {
		showSearch: PropTypes.bool.isRequired,
		searchInputHooks: PropTypes.array.isRequired
	}
	
	handleSearchInputLocal = (event) => {
		// Trigger all hooks listening for changes in the search input and
		// give them the new input through the first parameter.
		this.props.searchInputHooks.forEach(hook => {
			hook(event.target.value);
		});
	}

	render() {
		const { showSearch } = this.props;
		return (
			<>
				{ showSearch ? (
					<header className="search-books">
						<div className="search-books-bar">
							<Link to="/">
								<button className="close-search">Close</button>
							</Link>
							<div className="search-books-input-wrapper">
								{/*
									NOTES: The search from BooksAPI is limited to a particular set of search terms.
									You can find these search terms here:
									https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

									However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
									you don't find a specific author or title. Every search is limited by search terms.
								*/}
								<input onChange={ this.handleSearchInputLocal } type="text" placeholder="Search by title or author" autoFocus />

							</div>
						</div>
					</header>
				) : (
					<header className="list-books-title">
						<h1>Book Tracker</h1>
					</header>
				)}
			</>
		);
	}
}
