import axios from "axios";

const URL = "https://api.themoviedb.org/3";
const API_KEY = "69139b7d70f92e920405689eab0b7033";


const endpoints = {
  trending: "/trending/all/week",
  popular: "/movie/popular",
  top_rated: "/movie/top_rated",
  upcoming: "/movie/upcoming",
  now_playing: "/movie/now_playing",
  discover_tv: "/discover/tv",
  tv_changes: "/tv/changes",
  person_changes: "/person/changes",
};

export const fetchData = (param) => {
    return axios.get(`${URL}${endpoints[param]}?api_key=${API_KEY}`)
}