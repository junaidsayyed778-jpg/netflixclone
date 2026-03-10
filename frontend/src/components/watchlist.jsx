import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWatchlist, removeWatchlist } from "../features/services/watchlistServices";

const Watchlist = () => {

  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const fetchWatchlist = async () => {
    try {
      const res = await getWatchlist();
      setMovies(res.data.watchlist || []);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  };

  const handleRemove = async (movieId, e) => {

    e.stopPropagation(); // 🚀 prevent navigation

    try {

      await removeWatchlist(movieId);

      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.movieId !== movieId)
      );

    } catch (error) {
      console.error("Error removing movie:", error);
    }

  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  return (
    <div className="watchlist">

      <h1>My Watchlist</h1>

      {movies.length === 0 ? (

        <p className="watchlist__empty">
          No movies in your watchlist
        </p>

      ) : (

        <div className="watchlist__grid">

          {movies.map((movie) => (

            <div
              key={movie.movieId}
              className="watchlist__card"
              onClick={() => navigate(`/title/movie/${movie.movieId}`)}
            >

              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster}`}
                alt={movie.title}
              />

              <p className="watchlist__title">
                {movie.title}
              </p>

              <button
                className="watchlist__remove"
                onClick={(e) => handleRemove(movie.movieId, e)}
              >
                Remove
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default Watchlist;