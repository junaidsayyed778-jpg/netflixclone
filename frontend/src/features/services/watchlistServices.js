// src/features/services/watchlistServices.js
import axios from "axios";

const api = axios.create({
  // ✅ FIXED: Removed trailing spaces in URL
  baseURL: "https://netflixclone-backend-v626.onrender.com/api/watchlist",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add movie to watchlist
export const addToWatchlist = (movie) => {
  return api.post("/add", movie);
};

// ✅ Get user's watchlist
export const getWatchlist = () => {
  return api.get("/");
};

// ✅ Remove movie from watchlist (FIXED: was removeWatchlist)
export const removeFromWatchlist = (movieId) => {
  return api.delete(`/${movieId}`);
};


// ✅ FIXED: Properly handle all response formats
export const checkInWatchlist = async (movieId) => {
  try {
    const res = await api.get("/");
    const data = res.data;
    
    console.log("🔍 checkInWatchlist response:", data); // Debug log
    
    // Handle different backend response formats
    let watchlist = [];
    
    if (Array.isArray(data)) {
      // Format: [...]
      watchlist = data;
    } else if (Array.isArray(data?.movies)) {
      // Format: { movies: [...] }
      watchlist = data.movies;
    } else if (Array.isArray(data?.watchlist)) {
      // Format: { watchlist: [...] }
      watchlist = data.watchlist;
    } else if (Array.isArray(data?.data)) {
      // Format: { data: [...] }
      watchlist = data.data;
    } else {
      // Fallback: empty array
      watchlist = [];
      console.warn("⚠️ Unexpected watchlist format:", data);
    }
    
    return watchlist.some((m) => 
      m.movieId === movieId || m.id === movieId || String(m.movieId) === String(movieId)
    );
    
  } catch (err) {
    console.error("Error checking watchlist:", err);
    return false;
  }
};