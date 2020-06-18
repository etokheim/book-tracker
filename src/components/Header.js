import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Header extends Component {
	handleSearchInputLocal = (event) => {
		// Trigger all hooks listening for changes in the search input and
		// give them the new input through the first parameter.
		this.props.searchInputHooks.forEach(hook => {
			hook(event.target.value);
		});
	}
	
	static propTypes = {
		showSearch: PropTypes.bool.isRequired,
		searchInputHooks: PropTypes.array.isRequired
	}

	render() {
		const { showSearch } = this.props;
		return (
			<>
				{ showSearch ? (
					<header className="search-books">
						<div className="search-books-bar">
							<button className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</button>
							<div className="search-books-input-wrapper">
								{/*
									NOTES: The search from BooksAPI is limited to a particular set of search terms.
									You can find these search terms here:
									https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

									However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
									you don't find a specific author or title. Every search is limited by search terms.
								*/}
								<input onChange={ this.handleSearchInputLocal } type="text" placeholder="Search by title or author" />

							</div>
						</div>
					</header>
				) : (
					<header className="list-books-title">
						<h1>MyReads</h1>
					</header>
				)}
			</>
		);
	}
}
