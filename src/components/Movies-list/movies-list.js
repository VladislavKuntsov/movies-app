import React from 'react';
import { Spin as Spinner, Alert } from 'antd';
import PropTypes from 'prop-types';
import MovieItem from '../Movie-item/movie-item';
import './movies-list.css';

function MoviesList({ movies, loadingIndicator, error, sendMoveRatingItem, switchSearchRate, moviesListRating, rating }) {
 
  const hasData = loadingIndicator || error;

  const errorMessage = error ? (
    <Alert message="BOOM!" description="Please reload the page!" type="error" showIcon />
  ) : null;

  const errorMessageSearch = !switchSearchRate ? (
    <Alert description="The search has not given any results!" type="info" />
  ) : null;

  const errorMessadgeRated = switchSearchRate ? <Alert description="You have no rated films!" type="info" /> : null;

  const errorSearch = movies.length === 0 && loadingIndicator === false ? errorMessageSearch : null;
  const errorRated = moviesListRating.length === 0 ? errorMessadgeRated : null;

  const spinner = loadingIndicator ? <Spinner size="large" /> : null;

  const moviesAvailability = !hasData ? (
    <MoviesView movies={movies} sendMoveRatingItem={sendMoveRatingItem} rating={rating} />
  ) : null;

  return (
    <div className="movies-list">
      {spinner}
      {moviesAvailability}
      {errorMessage}
      {errorSearch}
      {errorRated}
    </div>
  );
}

MoviesList.defaultProps = {
  sendMoveRatingItem: () => {},
  movies: [],
};

MoviesList.propTypes = {
  sendMoveRatingItem: PropTypes.func,
  movies: PropTypes.arrayOf(PropTypes.object),
  moviesListRating: PropTypes.arrayOf(PropTypes.object).isRequired,
  rating: PropTypes.arrayOf(PropTypes.object).isRequired,
  loadingIndicator: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  switchSearchRate: PropTypes.bool.isRequired,
};

const MoviesView = ({ movies, sendMoveRatingItem, rating }) => {
  const cards = movies.map(({ id, ...items }) => {
    const card = <MovieItem key={id} {...items} sendMoveRatingItem={sendMoveRatingItem} rating={rating} id={id} />;
    return card;
  });
  return cards;
};

export default MoviesList;