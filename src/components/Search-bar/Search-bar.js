import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import './Search-bar.css';

function SearchBar({ switchSearchRate, onSearchChange }) {
  const onSearch = (event) => {
    const newTerm = event.target.value;

    onSearchChange(newTerm);
  };

  const classNameSearchBoxHide = !switchSearchRate ? 'search-box' : 'hide';

  return (
    <div className={classNameSearchBoxHide}>
      <form className="form-search">
        <input
          className="input-search"
          type="text"
          placeholder="Type to search..."
          onChange={debounce(onSearch, 500)}
        />
      </form>
    </div>
  );
}

SearchBar.defaultProps = {
  onSearchChange: () => {},
};

SearchBar.propTypes = {
  onSearchChange: PropTypes.func,
  switchSearchRate: PropTypes.bool.isRequired,
};

export default SearchBar;
