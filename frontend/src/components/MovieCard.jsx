import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToWatchlist } from "../features/services/watchlistServices";

const MovieCard = ({ movie }) => {

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleWatchlist = async (e) => {

    e.stopPropagation(); // 🚀 prevents card click

    try {

      const res = await addToWatchlist({
        movieId: movie.id,
        title: movie.title || movie.name,
        poster: movie.poster_path,
      });

      setMessage("Added to watchlist ✅");

      setTimeout(() => {
        setMessage("");
      }, 2000);

      console.log("Added:", res.data);

    } catch (error) {

      console.log("Watchlist error:", error.response?.data || error.message);

    }

  };

  const IMG_URL = "https://image.tmdb.org/t/p/w300";

  return (

    <div
      className="movieCard"
      onClick={() => navigate(`/title/movie/${movie.id}`)}
    >

      <div className="movieCard__imageWrapper">

        {message && (
          <div className="movieCard__message">{message}</div>
        )}

        <img
          className="movieCard__image"
          src={`${IMG_URL}${movie.poster_path}`}
          alt={movie.title || movie.name}
        />

      </div>

      <p className="movieCard__title">
        {movie.title || movie.name}
      </p>

      <button
        className="movieCard__watchlistBtn"
        onClick={handleWatchlist}
      >
        + Watchlist
      </button>

    </div>

  );

};

export default MovieCard;