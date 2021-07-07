import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Rate } from 'antd';
import './movie-item.css';
import { GenresConsumer } from '../App/app';

function MovieItem({
  poster_path: posterPath,
  overview,
  rating,
  vote_average: voteAverage,
  release_date: releaseDate,
  genre_ids: genreIds,
  original_title: originalTitle,
  id,
  sendMoveRatingItem,
}) {
  const directoryPath = 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2';

  const noMoviePoster = 'https://kinomaiak.ru/wp-content/uploads/2018/02/noposter.png';

  const ellipsis = '...';

  const setRatingMovie = (searchId, ratingAll) => {
    const newRating = ratingAll.find((rat) => rat.id === searchId);

    if (typeof newRating === 'undefined') return 0;

    return newRating.rating;
  };

  const setMovieGenre = (arrGenreID, arrGenresString) => {
    const arrGenres = [];

    const filteredGenres = arrGenresString.filter((item) => arrGenreID.indexOf(item.id) > -1);

    filteredGenres.forEach((item) => arrGenres.push(item.name));

    return arrGenres;
  };

  const moveRatingItem = (value) => {
    sendMoveRatingItem(value, id);
  };

  const minifyText = (text, length) => {
    if (text.length <= 145) return text;

    return text.slice(0, text.indexOf(' ', length)) + ellipsis;
  };

  const сhangingDateFormat = (data) =>
    new Date(data).toLocaleString('en-us', { month: 'long', year: 'numeric', day: 'numeric' });

  const ratingColor = (data) => {
    if (data >= 0 && data <= 3) return 'vote-average-ratingRed';
    if (data > 3 && data <= 5) return 'vote-average-ratingOrange';
    if (data > 5 && data <= 7) return 'vote-average-ratingYellow';
    if (data > 7) return 'vote-average-ratingGreen';

    return 'vote-average-ratingRed';
  };

  const newRating = setRatingMovie(id, rating);
  const newText = minifyText(overview, 140);
  const newFormatData = releaseDate ? сhangingDateFormat(releaseDate) : 'Date not specified';
  const fullAddressPoster = posterPath ? directoryPath + posterPath : noMoviePoster;
  const classVoteAverage = classNames('vote-average', ratingColor(voteAverage));

  return (
    <GenresConsumer>
      {(genresList) => (
        <div className="movieItem">
          <div className="movieItem_content">
            <div className="content-container">
              <h1 className="movieItem_title">{originalTitle}</h1>
              <p className="movieItem_data">{newFormatData}</p>
              <div className="movieItem_genre">
                <GenresMoviesItem genresMovie={setMovieGenre(genreIds, genresList)} />
              </div>
              <p className="movieItem_text">{newText}</p>
            </div>
            <div className="rate-container">
              <div className="rate">
                <Rate count={10} allowHalf value={newRating} onChange={moveRatingItem} />
              </div>
            </div>
            <div className={classVoteAverage}>
              <span>{voteAverage}</span>
            </div>
          </div>
          <div className="movieItem_figure">
            <img className="poster" src={fullAddressPoster} alt="" />
          </div>
        </div>
      )}
    </GenresConsumer>
  );
}

MovieItem.defaultProps = {
  sendMoveRatingItem: () => {},
  rating: [],
  poster_path: '',
  release_date: '',
};

MovieItem.propTypes = {
  sendMoveRatingItem: PropTypes.func,
  rating: PropTypes.arrayOf(PropTypes.object),
  genre_ids: PropTypes.arrayOf(PropTypes.number).isRequired,
  poster_path: PropTypes.string,
  overview: PropTypes.string.isRequired,
  release_date: PropTypes.string,
  original_title: PropTypes.string.isRequired,
  vote_average: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
};

const GenresMoviesItem = ({ genresMovie }) => {
  const genresCard = genresMovie.map((item) => (
    <a className="badge disabled" href="/" key={item}>
      <p className="badge-text">{item}</p>
    </a>
  ));

  return genresCard;
};

export default MovieItem;
