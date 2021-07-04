import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Rate } from 'antd';
import './movie-item.css';
import { GenresConsumer } from '../App/app';

export default class MovieItem extends Component {
  directoryPath = 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2';

  noMoviePoster = 'https://kinomaiak.ru/wp-content/uploads/2018/02/noposter.png';

  ellipsis = '...';

  static defaultProps = {
    sendMoveRatingItem: () => {},
    rating: [],
    poster_path: this.noMoviePoster,
    release_date: '',
  };

  static propTypes = {
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

  setRatingMovie(searchId, rating) {
    const newRating = rating.find((rat) => rat.id === searchId);

    if (typeof newRating === 'undefined') return 0;

    return newRating.rating;
  }

  setMovieGenre(arrGenreID, arrGenresString) {
    const arrGenres = [];

    const filteredGenres = arrGenresString.filter(({ id }) => arrGenreID.indexOf(id) > -1);

    filteredGenres.forEach((item) => arrGenres.push(item.name));

    return arrGenres;
  }

  moveRatingItem = (value) => {
    const { sendMoveRatingItem, id } = this.props;

    sendMoveRatingItem(value, id);
  };

  minifyText(text, length) {
    if (text.length <= 145) return text;

    return text.slice(0, text.indexOf(' ', length)) + this.ellipsis;
  }

  сhangingDateFormat(data) {
    return new Date(data).toLocaleString('en-us', { month: 'long', year: 'numeric', day: 'numeric' });
  }

  ratingColor(data) {
    if (data >= 0 && data <= 3) return 'vote-average-ratingRed';
    if (data > 3 && data <= 5) return 'vote-average-ratingOrange';
    if (data > 5 && data <= 7) return 'vote-average-ratingYellow';
    if (data > 7) return 'vote-average-ratingGreen';

    return 'vote-average-ratingRed';
  }

  render() {
    const {
      poster_path: posterPath,
      overview,
      rating,
      vote_average: voteAverage,
      release_date: releaseDate,
      genre_ids: genreIds,
      original_title: originalTitle,
      id,
    } = this.props;

    const newRating = this.setRatingMovie(id, rating);
    const newText = this.minifyText(overview, 140);
    const newFormatData = this.сhangingDateFormat(releaseDate);
    const fullAddressPoster = posterPath ? this.directoryPath + posterPath : this.noMoviePoster;
    const classVoteAverage = classNames('vote-average', this.ratingColor(voteAverage));

    return (
      <GenresConsumer>
        {(genresList) => (
          <div className="movieItem">
            <div className="movieItem_content">
              <div className="content-container">
                <h1 className="movieItem_title">{originalTitle}</h1>
                <p className="movieItem_data">{newFormatData}</p>
                <div className="movieItem_genre">
                  <GenresMoviesItem genresMovie={this.setMovieGenre(genreIds, genresList)} />
                </div>
                <p className="movieItem_text">{newText}</p>
              </div>
              <div className="rate-container">
                <div className="rate">
                  <Rate count={10} allowHalf value={newRating} onChange={this.moveRatingItem} />
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
}

const GenresMoviesItem = ({ genresMovie }) => {
  const genresCard = genresMovie.map((item) => (
    <a className="badge disabled" href="/" key={item}>
      <p className="badge-text">{item}</p>
    </a>
  ));

  return genresCard;
};
