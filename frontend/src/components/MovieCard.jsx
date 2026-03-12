import { useNavigate } from "react-router-dom";


const MovieCard = ({ movie, type }) => {
  const navigate = useNavigate();
  
  // ✅ Fixed: Removed extra spaces in URLs
  const IMG_URL = "https://image.tmdb.org/t/p/w300";
  const PLACEHOLDER = "https://via.placeholder.com/300x450?text=No+Image";
  
  // Rating calculation (TMDB: 0-10 → 0-5 scale)
  const rating = movie.vote_average ? (movie.vote_average / 2).toFixed(1) : "N/A";
  const voteCount = movie.vote_count || 0;
  const year = movie.release_date?.split("-")[0] 
    || movie.first_air_date?.split("-")[0] 
    || "N/A";

  const handleClick = () => {
    navigate(`/title/movie/${movie.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/title/movie/${movie.id}`);
    }
  };

  return (
    <article 
      className="movie-card" 
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${movie.title || movie.name}`}
    >
      <div className="movie-card__image-wrapper">
        
        {/* ⭐ Rating Badge */}
        <div className="movie-card__rating" aria-label={`Rating: ${rating} out of 5`}>
          <span className="movie-card__rating-icon">⭐</span>
          <span className="movie-card__rating-value">{rating}</span>
        </div>

        {/* 🖼️ Poster Image */}
        <img
          className="movie-card__poster"
          src={movie.poster_path ? `${IMG_URL}${movie.poster_path}` : PLACEHOLDER}
          alt={movie.title || movie.name}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = PLACEHOLDER;
          }}
          draggable={false}
        />
        
        {/* 🌓 Hover Overlay */}
        <div className="movie-card__overlay">
          <span className="movie-card__view-text">View Details</span>
        </div>
      </div>

      {/* 📝 Card Content */}
      <div className="movie-card__content">
        <h3 className="movie-card__title" title={movie.title || movie.name}>
          {movie.title || movie.name}
        </h3>
        
        <div className="movie-card__meta">
          <span className="movie-card__year">{year}</span>
          {voteCount > 0 && (
            <span className="movie-card__votes">• {voteCount.toLocaleString()}</span>
          )}
        </div>
      </div>
    </article>
  );
};

export default MovieCard;