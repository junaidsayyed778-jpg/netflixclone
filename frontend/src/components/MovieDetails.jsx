// src/pages/MovieDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../features/hooks/useAuth";
import {
  getMovieDetails,
  getMovieRecommendations,
  getMovieTrailer,
} from "../features/services/movieService";
// ✅ Import FIXED watchlist services
import { 
  addToWatchlist, 
  removeFromWatchlist, 
  checkInWatchlist,
  getWatchlist 
} from "../features/services/watchlistServices";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  
  // ✅ Watchlist states
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistMessage, setWatchlistMessage] = useState("");

  // ───────────────────────────────────────────────────
  // Check if movie is in watchlist (when user + movie loaded)
  // ───────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !movie?.id) return;
    
    const checkStatus = async () => {
      try {
        const isInList = await checkInWatchlist(movie.id);
        setInWatchlist(isInList);
      } catch (err) {
        console.error("Error checking watchlist status:", err);
      }
    };
    
    checkStatus();
  }, [user, movie?.id]);

  // ───────────────────────────────────────────────────
  // Load Movie Data
  // ───────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const movieData = await getMovieDetails(id);
        
        if (!isMounted) return;
        
        if (movieData?.error) {
          setError("Unable to load movie details. Please try again.");
          setLoading(false);
          return;
        }
        
        setMovie(movieData);

        // Non-blocking fetches
        getMovieTrailer(id).then((trailerData) => {
          if (isMounted) setTrailer(trailerData);
        });

        getMovieRecommendations(id).then((similarData) => {
          if (isMounted) setSimilar(similarData.slice(0, 10));
        });

        setLoading(false);
        
      } catch (err) {
        console.error("Error loading movie:", err);
        if (isMounted) {
          setError("Failed to load movie. Please check your connection.");
          setLoading(false);
        }
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [id]);

  // ───────────────────────────────────────────────────
  // ✅ Handle Watchlist Toggle (Add/Remove)
  // ───────────────────────────────────────────────────
  const handleWatchlistToggle = async () => {
    if (!user || !movie?.id) return;
    
    setWatchlistLoading(true);
    setWatchlistMessage("");

    try {
      if (inWatchlist) {
        // 🗑️ Remove from watchlist
        await removeFromWatchlist(movie.id);
        setInWatchlist(false);
        setWatchlistMessage("❌ Removed from watchlist");
        
      } else {
        // ➕ Add to watchlist
        await addToWatchlist({
          movieId: movie.id,
          title: movie.title || movie.name,
          poster: movie.poster_path,
          rating: movie.vote_average,
          overview: movie.overview,
        });
        setInWatchlist(true);
        setWatchlistMessage("✅ Added to watchlist!");
      }
    } catch (err) {
      console.error("Watchlist API error:", err);
      
      // Show meaningful error
      const errorMsg = err.response?.data?.message || err.message || "Failed to update watchlist";
      setWatchlistMessage(`⚠️ ${errorMsg}`);
      
    } finally {
      setWatchlistLoading(false);
      // Auto-clear message after 3 seconds
      setTimeout(() => setWatchlistMessage(""), 3000);
    }
  };

  // ───────────────────────────────────────────────────
  // Loading State
  // ───────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="movie-details movie-details--loading">
        <div className="details__skeleton">
          <div className="skeleton__backdrop" />
          <div className="skeleton__content">
            <div className="skeleton__poster" />
            <div className="skeleton__info">
              <div className="skeleton__title" />
              <div className="skeleton__meta" />
              <div className="skeleton__overview" />
              <div className="skeleton__buttons" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ───────────────────────────────────────────────────
  // Error State
  // ───────────────────────────────────────────────────
  if (error || !movie) {
    return (
      <main className="movie-details movie-details--error">
        <div className="error__container">
          <h2>⚠️ Unable to Load Movie</h2>
          <p>{error || "Movie not found"}</p>
          <div className="error__actions">
            <button className="btn btn-primary" onClick={() => navigate(-1)}>
              ← Go Back
            </button>
            <button className="btn btn-secondary" onClick={() => window.location.reload()}>
              🔄 Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ───────────────────────────────────────────────────
  // Success: Render Movie Details
  // ───────────────────────────────────────────────────
  return (
    <main className="movie-details">
      
      {/* Backdrop */}
      {movie.backdrop_path && (
        <div 
          className="details__backdrop"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
        >
          <div className="backdrop__overlay" />
        </div>
      )}

      {/* Content */}
      <div className="details__container">
        
        {/* Poster + Info */}
        <div className="details__content">
          
          {/* Poster */}
          <div className="details__poster">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/500x750?text=No+Image";
                }}
                loading="lazy"
              />
            ) : (
              <div className="poster__placeholder">No Image</div>
            )}
          </div>

          {/* Info */}
          <div className="details__info">
            <h1 className="details__title">{movie.title || movie.name}</h1>
            
            {/* Meta */}
            <div className="details__meta">
              {movie.release_date && (
                <span>📅 {new Date(movie.release_date).getFullYear()}</span>
              )}
              {movie.runtime && <span>⏱️ {movie.runtime} min</span>}
              {movie.vote_average > 0 && (
                <span>⭐ {movie.vote_average.toFixed(1)}/10</span>
              )}
            </div>

            {/* Genres */}
            {movie.genres?.length > 0 && (
              <div className="details__genres">
                {movie.genres.map((g) => (
                  <span key={g.id} className="genre__tag">{g.name}</span>
                ))}
              </div>
            )}

            {/* Overview */}
            <p className="details__overview">{movie.overview}</p>

            {/* ✅ FIXED: Actions with Working Watchlist */}
            <div className="details__actions">
              
              {/* Trailer Button */}
              {trailer?.embedUrl && (
                <button 
                  className="btn btn-trailer"
                  onClick={() => setShowTrailer(true)}
                >
                  ▶ Play Trailer
                </button>
              )}
              
              {/* ✅ Watchlist Button - NOW CONNECTED TO BACKEND! */}
              {user ? (
                <button 
                  className={`btn btn-watchlist ${inWatchlist ? 'btn-watchlist--active' : ''}`}
                  onClick={handleWatchlistToggle}
                  disabled={watchlistLoading}
                  aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                >
                  {watchlistLoading ? (
                    <span className="btn__spinner" />
                  ) : inWatchlist ? (
                    "✓ In Watchlist"
                  ) : (
                    "+ Watchlist"
                  )}
                </button>
              ) : (
                <Link to="/login" className="btn btn-watchlist btn-watchlist--login">
                  🔐 Login to Save
                </Link>
              )}
              
              {/* Back Button */}
              <button className="btn btn-back" onClick={() => navigate(-1)}>
                ← Back
              </button>
            </div>

            {/* ✅ Watchlist Status Message */}
            {watchlistMessage && (
              <p className={`watchlist__message ${inWatchlist ? 'success' : 'error'}`}>
                {watchlistMessage}
              </p>
            )}

          </div>
        </div>

        {/* Trailer Modal */}
        {showTrailer && trailer?.embedUrl && (
          <div className="trailer__modal" onClick={() => setShowTrailer(false)}>
            <div className="trailer__content" onClick={(e) => e.stopPropagation()}>
              <button 
                className="trailer__close"
                onClick={() => setShowTrailer(false)}
                aria-label="Close trailer"
              >
                ✕
              </button>
              <iframe
                src={trailer.embedUrl}
                title="Movie Trailer"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Similar Movies */}
        {similar.length > 0 && (
          <section className="details__similar">
            <h3>More Like This</h3>
            <div className="similar__grid">
              {similar.map((m) => (
                <Link 
                  key={m.id} 
                  to={`/title/movie/${m.id}`}
                  className="similar__card"
                >
                  {m.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                      alt={m.title || m.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="similar__placeholder" />
                  )}
                  <p className="similar__title">{m.title || m.name}</p>
                  {m.vote_average > 0 && (
                    <span className="similar__rating">
                      ⭐ {(m.vote_average / 2).toFixed(1)}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
};

export default MovieDetails;