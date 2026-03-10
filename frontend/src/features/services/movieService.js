import axios from "axios";

const URL = "https://api.themoviedb.org/3";
const API_KEY = "69139b7d70f92e920405689eab0b7033";

const endpoints = {
  originals: "/discover/tv",
  trending: "/trending/all/week",
  now_playing: "/movie/now_playing",
  popular: "/movie/popular",
  top_rated: "/movie/top_rated",
  upcoming: "/movie/upcoming",
};

export const fetchMovies = async (type, page = 1) => {
  const res = await axios.get(`${URL}${endpoints[type]}?api_key=${API_KEY}&page=${page}`);
  return res.data.results;
};

export const searchMovies = async (query) => {
  const res = await axios.get( `${URL}/search/movie?api_key=${API_KEY}&query=${query}`)
  return res.data.results;
}

export const getMovieDetails = async (id) => {
  const res = await axios.get(
    `${URL}/movie/${id}?api_key=${API_KEY}`
  );
  return res.data
};

export const getMovieRecommendations = async (id) => {
  const res = await axios.get(
    `${URL}/movie/${id}/recommendations?api_key=${API_KEY}`
  );
  return res.data.results;
};

export const getTVDetails = async (id) => {
  const res = await axios.get(
    `${URL}/tv/${id}?api_key=${API_KEY}`
  );
  return res.data;
};

export const getTVRecommendations = async (id) => {
  const res = await axios.get(
    `${URL}/tv/${id}/recommendations?api_key=${API_KEY}`
  );
  return res.data.results;
};

export const getTVSimilar = async (id) => {
  const res = await axios.get(
    `${URL}/tv/${id}/similar?api_key=${API_KEY}`
  );
  return res.data.results;
};