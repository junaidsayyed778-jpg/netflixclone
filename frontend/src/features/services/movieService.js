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