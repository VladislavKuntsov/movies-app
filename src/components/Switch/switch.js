import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import './switch.css';

export default class Switch  extends Component {

    state = {
        term: ''
    }

    static defaultProps = {
        onRate: () => {},
        onSearch: () => {},
        onSearchChange: () => {},
    };

    static propTypes = {
        onRate: PropTypes.func,
        onSearch: PropTypes.func,  
        onSearchChange: PropTypes.func,   
        switchSearchRate: PropTypes.bool.isRequired,
    };

    onSearchChange = (event) => {
        const newTerm = event.target.value;
        
        this.setState({term: newTerm});

        const {term} = this.state;
        const {onSearchChange} = this.props;

        onSearchChange(term);
    } 

    render() {
        const {onRate, onSearch, switchSearchRate} = this.props
 
        const classNamesSearchSpan = !switchSearchRate ? 'active' : null;
        const classNamesRatedSpan = switchSearchRate ? 'active' : null;

        const classNameSearch = switchSearchRate ? 'sort-panel_search' : 'sort-panel_search active-border';
        const classNameRated = !switchSearchRate ? 'sort-panel_rated' : 'sort-panel_rated active-border';

        const classNameSearchBoxHide = !switchSearchRate ? 'search-box' : 'hide';

        return (
            <div className='container-sorting'>
                <div className='sort-panel'>
                    <div className={classNameSearch}>
                        <p onClick={onSearch} onKeyPress={onSearch} role="presentation">
                            <span className={classNamesSearchSpan}>Search</span>
                        </p>
                    </div>
                    <div className={classNameRated}>
                        <p onClick={onRate} onKeyPress={onSearch} role="presentation">
                            <span className={classNamesRatedSpan}>Rated</span>
                        </p>
                    </div>
                </div>  
                <div className={classNameSearchBoxHide}>
                    <form className='form-search'>
                        <input 
                            className="input-search" 
                            type="text" 
                            placeholder="Type to search..." 
                            onChange = {debounce(this.onSearchChange, 500)} 
                        />
                    </form>  
                </div>       
            </div>  
        )
    }
}