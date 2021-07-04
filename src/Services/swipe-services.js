import { Component } from 'react';

export default class SwapiServies extends Component {
  apiKey = '5f105a41f8151f6f9098425cca962509';

  async getResourse(url, option) {
    const response = await fetch(url, option);

    if (!response.ok) {
      return new Error(`Could not fetch ${url} received ${response.status}`);
    }

    const body = await response.json();

    return body;
  }

  getCreateQuestSession() {
    return this.getResourse(`https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${this.apiKey}`);
  }

  getMovieRated(guestSessionId) {
    return this.getResourse(
      `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=${this.apiKey}`
    );
  }

  getAllMovies(search, page) {
    return this.getResourse(
      `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&language=en-US&page=${page}&query=${search}&include_adult=false`
    );
  }

  getAllGenres() {
    return this.getResourse(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}&language=en-US`);
  }

  /*   getMoviesSearch() {
    return this.getResourse()
  } */

  async postResourse(url, options) {
    const response = await fetch(url, options);

    if (!response.ok) {
      return new Error(`Could not fetch ${url} received ${response.status}`);
    }

    const body = await response.json();

    return body;
  }

  postSendMoviesRating(guestSessionId, movieId, rating) {
    return this.postResourse(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          value: rating,
        }),
      }
    );
  }
}
