import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import './Search-bar.css';

export default class SearchBar extends Component {
  static defaultProps = {
    onSearchChange: () => {},
  };

  static propTypes = {
    onSearchChange: PropTypes.func,
    switchSearchRate: PropTypes.bool.isRequired,
  };

  onSearchChange = (event) => {
    const newTerm = event.target.value;

    const { onSearchChange } = this.props;

    onSearchChange(newTerm);
  };

  render() {
    const { switchSearchRate } = this.props;

    const classNameSearchBoxHide = !switchSearchRate ? 'search-box' : 'hide';

    return (
      <div className={classNameSearchBoxHide}>
        <form className="form-search">
          <input
            className="input-search"
            type="text"
            placeholder="Type to search..."
            onChange={debounce(this.onSearchChange, 500)}
          />
        </form>
      </div>
    );
  }
}
