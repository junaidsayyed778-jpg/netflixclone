// src/services/movieService.js
import axios from "axios";

// ───────────────────────────────────────────────────
// ✅ CONFIG (No trailing spaces!)
// ───────────────────────────────────────────────────
const API_KEY = "69139b7d70f92e920405689eab0b7033";
const BASE_URL = "https://api.themoviedb.org/3"; // ✅ No trailing spaces

// ✅ All endpoints (defined once, at top level)
const endpoints = {
  trending: "/trending/movie/week",
  popular: "/movie/popular",
  top_rated: "/movie/top_rated",
  upcoming: "/movie/upcoming",
  now_playing: "/movie/now_playing",
  search: "/search/movie",
};

// ✅ Axios instance (consistent across all functions)
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ✅ Simple cache
const cache = new Map();

// ───────────────────────────────────────────────────
// ✅ Fetch Movies (Fixed: uses axios + cache + proxy fallback)
// ───────────────────────────────────────────────────
export const fetchMovies = async (type, page = 1) => {
  // Check API key
  if (!API_KEY) {
    console.error("❌ VITE_API_KEY missing in frontend/.env");
    return [];
  }

  // Get endpoint
  const endpoint = endpoints[type]; // ✅ Now inside function
  if (!endpoint) {
    console.error(`❌ Unknown movie type: ${type}`);
    return [];
  }

  // Check cache first
  const cacheKey = `${type}-${page}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    // Build URL (no trailing spaces!)
    const url = `${endpoint}?api_key=${API_KEY}&page=${page}&language=en-US`;
    
    // Try direct axios call first
    const res = await api.get(url);
    const results = res.data.results || [];
    
    // Cache successful response
    cache.set(cacheKey, results);
    console.log(`✅ Fetched ${results.length} ${type} movies`);
    
    return results;
    
  } catch (directErr) {
    console.warn(`⚠️ Direct fetch failed: ${directErr.message}`);
    
    // Fallback: Try with proxy (for CORS/India issues)
    try {
      const tmdbUrl = `${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}&language=en-US`;
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(tmdbUrl)}`;
      
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      const results = data.results || [];
      
      cache.set(cacheKey, results);
      console.log(`✅ Fetched via proxy: ${results.length} ${type} movies`);
      
      return results;
      
    } catch (proxyErr) {
      console.error(`❌ Proxy fetch also failed: ${proxyErr.message}`);
      return [];
    }
  }
};

// ───────────────────────────────────────────────────
// ✅ Search Movies (Uses axios instance)
// ───────────────────────────────────────────────────
export const searchMovies = async (query, page = 1) => {
  if (!API_KEY || !query?.trim()) return [];

  try {
    const url = `/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`;
    const res = await api.get(url);
    return res.data.results || [];
  } catch (err) {
    console.error("Search failed:", err.message);
    return [];
  }
};

// ───────────────────────────────────────────────────
// ✅ Get Movie Details (Uses axios instance)
// ───────────────────────────────────────────────────
export const getMovieDetails = async (movieId) => {
  if (!API_KEY) return getFallbackMovie(movieId);

  try {
    const url = `/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=videos,credits`;
    const res = await api.get(url);
    return res.data;
  } catch (err) {
    console.error("Movie details failed:", err.message);
    return getFallbackMovie(movieId);
  }
};

// ───────────────────────────────────────────────────
// ✅ Get Trailer (Uses axios instance)
// ───────────────────────────────────────────────────
export const getMovieTrailer = async (movieId) => {
  if (!API_KEY) return null;

  try {
    const url = `/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`;
    const res = await api.get(url);
    const videos = res.data.results || [];
    
    const trailer = videos.find(v => 
      v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
    );
    
    return trailer ? {
      key: trailer.key,
      // ✅ No trailing spaces in embed URL!
      embedUrl: `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`,
    } : null;
  } catch (err) {
    console.warn("Trailer fetch failed:", err.message);
    return null;
  }
};

// ───────────────────────────────────────────────────
// ✅ Get Similar Movies (Uses axios instance)
// ───────────────────────────────────────────────────
export const getSimilarMovies = async (movieId, page = 1) => {
  if (!API_KEY || !movieId) return [];

  try {
    const url = `/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=${page}`;
    const res = await api.get(url);
    return res.data.results || [];
  } catch (err) {
    console.error("Similar movies failed:", err.message);
    return [];
  }
};

// ───────────────────────────────────────────────────
// ✅ Get Recommendations (Uses axios instance)
// ───────────────────────────────────────────────────
export const getMovieRecommendations = async (movieId, page = 1) => {
  if (!API_KEY || !movieId) return [];

  try {
    const url = `/movie/${movieId}/recommendations?api_key=${API_KEY}&language=en-US&page=${page}`;
    const res = await api.get(url);
    return res.data.results || [];
  } catch (err) {
    console.error("Recommendations failed:", err.message);
    return [];
  }
};

// ───────────────────────────────────────────────────
// ✅ Fallback Movie Data (When API fails)
// ───────────────────────────────────────────────────
const getFallbackMovie = (movieId) => ({
  id: movieId,
  title: "Unable to load",
  overview: "Please check your connection and try again.",
  poster_path: null,
  backdrop_path: null,
  videos: { results: [] },
  credits: { cast: [] },
});

// ───────────────────────────────────────────────────
// ✅ Clear Cache (For refresh)
// ───────────────────────────────────────────────────
export const clearMovieCache = () => {
  cache.clear();
  console.log("🧹 Movie cache cleared");
};