import React from 'react';
import PropTypes from 'prop-types';
import './switch.css';

function Switch({onRate, onSearch, switchSearchRate}) {
  
  const classSwitch = {
    classNamesSearchSpan: !switchSearchRate ? 'active' : null,
    classNamesRatedSpan: switchSearchRate ? 'active' : null,
    classNameSearch: switchSearchRate ? 'sort-panel_search' : 'sort-panel_search active-border',
    classNameRated: !switchSearchRate ? 'sort-panel_rated' : 'sort-panel_rated active-border',
  }; 

  return (
    <div className="container-sorting">
      <div className="sort-panel">
        <div className={classSwitch.classNameSearch}>
          <p onClick={onSearch} onKeyPress={onSearch} role="presentation">
            <span className={classSwitch.classNamesSearchSpan}>Search</span>
          </p>
        </div>
        <div className={classSwitch.classNameRated}>
          <p onClick={onRate} onKeyPress={onSearch} role="presentation">
            <span className={classSwitch.classNamesRatedSpan}>Rated</span>
          </p>
        </div>
      </div>
    </div>
  );
}

Switch.defaultProps = {
  onRate: () => {},
  onSearch: () => {},
};

Switch.propTypes = {
  onRate: PropTypes.func,
  onSearch: PropTypes.func,
  switchSearchRate: PropTypes.bool.isRequired,
};

export default Switch;
