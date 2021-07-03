import React, { Component } from 'react';
import { Pagination as Pagin } from 'antd';
import MoviesList from '../Movies-list/movies-list';
import SwapiServies from '../../Services/swipe-services';
import Switch from '../Switch/switch';
import SearchBar from '../Search-bar/Search-bar';

import 'antd/dist/antd.css';
import './app.css';

const MovieDBService = new SwapiServies();

export const {
    Provider: GenresProvider,
    Consumer: GenresConsumer,
} = React.createContext(); 

export default class App extends Component {

    state = {
        guestSessionId: null,
        moviesList: [],
        moviesListRating: [],
        genresList: [],
        ratingMovies: [],
        loading: true,
        error: false,
        term: 'Tom',
        page: '1',
        switchSearchRate: false,
    }

    componentDidMount() {
        const {term} =this.state

        this.setQuestSession();
        this.setMovies(term);
        this.setMoviesGenres();
    }

    componentDidUpdate(prevProps, prevState) {
        const {term, page} = this.state

        if (term !== prevState.term || page !== prevState.page) {
            this.setMovies(term, page);
        }
    }

    setQuestSession() {
        MovieDBService.getCreateQuestSession()
        .then((body) => {
            this.setState({guestSessionId: body.guest_session_id}) 
        })
    }  

    setMovies(search, page) {
        MovieDBService.getAllMovies(search, page)
        .then((body) => {
            const movies = body.results.slice(0, 6);
            
            this.setState({
                moviesList: movies,
                loading: false,
            })
        })
        .catch(this.onError)
    }

    setMovieRated(guestSessionId) {
        MovieDBService.getMovieRated(guestSessionId)
        .then((body) => {
            this.setState({moviesListRating: body.results}) 
        })
    }

    setMoviesGenres() {
        MovieDBService.getAllGenres()
        .then((body) => {
            this.setState({genresList: body.genres})
        })
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false,
        })
    }

    ratedMovies = (page, moviesListRating) => {
        const movie = moviesListRating.filter((item, index) => index >= page * 6 - 6 && index < page * 6 )

        return movie
    }

    onSearchChange = (term) => {
        let newTerm = term;

        if(newTerm === '') {
            newTerm = 'Tom'
        }

        this.setState({
            term: newTerm,
            page: '1'
        })
    }

    onPaginClick = (pages) => {
        this.setState({page: String(pages)});
    }

    sendMoveRatingItem = (rating, movieId) => {
        const {guestSessionId} = this.state;

        this.postSendMoviesRating(guestSessionId, movieId, rating); 

        const movieRating = {
                id: movieId,
                rating,
        }

        this.setState(({ ratingMovies }) => {

            if(ratingMovies.length === 0) {
                return {
                    ratingMovies: [movieRating],
                }
            }

            const newMoviesRating = ratingMovies.filter(item=> item.id !== movieId)   

            const newRatingMovies = [...newMoviesRating, movieRating]

            return {
                ratingMovies: newRatingMovies,
            }
        })   
    }

    onRate = () => {
        const {guestSessionId} = this.state;

        this.setMovieRated(guestSessionId);
        this.setState({
            switchSearchRate: true,
            page:'1'
        })
    }

    onSearch = () => {
        this.setState({
            switchSearchRate: false,
            page:'1'
        })
    }

    postSendMoviesRating(guestSessionId, movieId, rating) {
        MovieDBService.postSendMoviesRating(guestSessionId, movieId, rating)
    }

    render() {
        const { moviesList, moviesListRating, genresList, loading, error, switchSearchRate, ratingMovies, page} = this.state;
        const visibleMovies = switchSearchRate ? this.ratedMovies(page, moviesListRating) : moviesList;

        return (
            <GenresProvider value={genresList}>
                <div>
                    <Switch
                        onRate={this.onRate}
                        onSearch={this.onSearch}
                        switchSearchRate = {switchSearchRate} 
                    />
                    <SearchBar 
                    onSearchChange={this.onSearchChange}
                    switchSearchRate = {switchSearchRate} 
                    />
                    <MoviesList
                        movies={visibleMovies}
                        rating = {ratingMovies}
                        loadingIndicator={loading}
                        error={error}
                        sendMoveRatingItem={this.sendMoveRatingItem}
                        switchSearchRate={switchSearchRate}
                        moviesListRating={moviesListRating}
                    />
                    <div className='pagination' >
                        <Pagin
                            defaultCurrent={1} 
                            current={Number(page)} 
                            total={50}
                            onChange={this.onPaginClick}
                        />
                    </div>
                </div>
            </GenresProvider>
        )
    }
}