import React, { Component } from 'react';
import { Pagination as Pagin } from 'antd';
import MoviesList from '../Movies-list/movies-list';
import SwapiServies from '../../Services/swipe-services';
import Switch from '../Switch/switch';
import SearchBar from '../Search-bar/Search-bar';

import 'antd/dist/antd.css';
import './app.css';

const MovieDBService = new SwapiServies();

export const { Provider: GenresProvider, Consumer: GenresConsumer } = React.createContext();

export default class App extends Component {
  
  state = {
    guestSessionId: null,
    moviesList: [],
    totalResultsMovies: null,
    totalResultsRatedMovies: null, 
    moviesListRating: [],
    genresList: [],
    ratingMovies: [],
    loading: true,
    error: false,
    term: 'Tom',
    page: '1',
    switchSearchRate: false,
  };

  componentDidMount() {
    const { term } = this.state;

    this.setQuestSession();
    this.setMovies(term);
    this.setMoviesGenres();
  }

  componentDidUpdate(prevProps, prevState) {
    const { term, page, switchSearchRate, guestSessionId} = this.state;

    if (term !== prevState.term || page !== prevState.page && !switchSearchRate) {
      this.setMovies(term, page);
    }

    if (term !== prevState.term || page !== prevState.page && switchSearchRate) {
      this.setMovieRated(guestSessionId, page);
    }
  }

  setQuestSession() {
    MovieDBService.getCreateQuestSession().then((body) => {
      this.setState({ guestSessionId: body.guest_session_id });
    });
  }

  setMovies(search, page) {
    MovieDBService.getAllMovies(search, page)
      .then((body) => {
        const movies = body.results;
        
        this.setState({
          moviesList: movies,
          totalResultsMovies: body.total_results,
          loading: false,
        });
      })
      .catch(this.onError);
  }

  setMovieRated(guestSessionId, page) {
    MovieDBService.getMovieRated(guestSessionId, page).then((body) => {

      this.setState({ 
        moviesListRating: body.results,
        totalResultsRatedMovies: body.total_results,
      });
    });
  }

  setMoviesGenres() {
    MovieDBService.getAllGenres().then((body) => {
      this.setState({ genresList: body.genres });
    });
  }

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  onSearchChange = (term) => {
    let newTerm = term;

    if (newTerm === '') {
      newTerm = 'Tom';
    }

    this.setState({
      term: newTerm,
      page: '1',
    });
  };

  onPaginClick = (pages) => {
    this.setState({ page: String(pages) });
    window.scrollTo(0, 0);
  };

  sendMoveRatingItem = (rating, movieId) => {
    const { guestSessionId } = this.state;

    this.postSendMoviesRating(guestSessionId, movieId, rating);

    const movieRating = {
      id: movieId,
      rating,
    };

    this.setState(({ ratingMovies }) => {
      if (ratingMovies.length === 0) {
        return {
          ratingMovies: [movieRating],
        };
      }

      const newMoviesRating = ratingMovies.filter((item) => item.id !== movieId);

      const newRatingMovies = [...newMoviesRating, movieRating];

      return {
        ratingMovies: newRatingMovies,
      };
    });
  };

  onRate = () => {
    const { guestSessionId, page } = this.state;

    this.setMovieRated(guestSessionId, page);

    this.setState({
      switchSearchRate: true,
      page: '1',
    });
  };

  onSearch = () => {
    const { term, page } = this.state;

    this.setMovies(term, page);

    this.setState({
      switchSearchRate: false,
      page: '1',
    });
  };

  postSendMoviesRating(guestSessionId, movieId, rating) {
    MovieDBService.postSendMoviesRating(guestSessionId, movieId, rating);
  }

  render() {
    const { moviesList, totalResultsMovies, totalResultsRatedMovies,  moviesListRating, genresList, loading, error, switchSearchRate, ratingMovies, page} =
      this.state;

    const visibleMovies = switchSearchRate ? moviesListRating : moviesList;

    const classNamePagination = (moviesList.length !== 0 && !switchSearchRate) || (ratingMovies.length !== 0 && switchSearchRate)? 'pagination' : 'hide'  
    const total = !switchSearchRate ? totalResultsMovies : totalResultsRatedMovies;

    return (
      <GenresProvider value={genresList}>
        <div >
          <Switch onRate={this.onRate} onSearch={this.onSearch} switchSearchRate={switchSearchRate} />
          <SearchBar onSearchChange={this.onSearchChange} switchSearchRate={switchSearchRate} />
          <MoviesList
            movies={visibleMovies}
            rating={ratingMovies}
            loadingIndicator={loading}
            error={error}
            sendMoveRatingItem={this.sendMoveRatingItem}
            switchSearchRate={switchSearchRate}
            moviesListRating={moviesListRating}
          />
          <div className={classNamePagination}>
            <Pagin 
            defaultCurrent={1} 
            current={Number(page)} 
            total={total} 
            showSizeChanger={false}
            pageSize={20} 
            showQuickJumper
            onChange={this.onPaginClick} />
          </div>
        </div>
      </GenresProvider>
    );
  }
}
