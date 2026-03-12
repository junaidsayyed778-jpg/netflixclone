// src/pages/MovieDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../features/hooks/useAuth";
import {
  getMovieDetails,
  getMovieRecommendations,
  getMovieTrailer,
} from "../features/services/movieService";


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

  // ───────────────────────────────────────────────────
  // Load Data
  // ───────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch movie details (with fallback)
        const movieData = await getMovieDetails(id);
        
        if (!isMounted) return;
        
        // Check if we got error fallback
        if (movieData.error) {
          setError("Unable to load movie details. Please try again.");
          setLoading(false);
          return;
        }
        
        setMovie(movieData);

        // Fetch trailer (non-blocking - don't crash if fails)
        getMovieTrailer(id).then((trailerData) => {
          if (isMounted) setTrailer(trailerData);
        });

        // Fetch similar movies (non-blocking)
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

            {/* Actions */}
            <div className="details__actions">
              {/* Trailer Button */}
              {trailer && (
                <button 
                  className="btn btn-trailer"
                  onClick={() => setShowTrailer(true)}
                >
                  ▶ Play Trailer
                </button>
              )}
              
              {/* Watchlist Button */}
              {user && (
                <button className="btn btn-watchlist">
                  + Watchlist
                </button>
              )}
              
              {/* Back Button */}
              <button className="btn btn-back" onClick={() => navigate(-1)}>
                ← Back
              </button>
            </div>
          </div>
        </div>

        {/* Trailer Modal */}
        {showTrailer && trailer && (
          <div className="trailer__modal" onClick={() => setShowTrailer(false)}>
            <div className="trailer__content" onClick={(e) => e.stopPropagation()}>
              <button 
                className="trailer__close"
                onClick={() => setShowTrailer(false)}
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
                  to={`/movie/${m.id}`}
                  className="similar__card"
                >
                  {m.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                      alt={m.title}
                      loading="lazy"
                    />
                  ) : (
                    <div className="similar__placeholder" />
                  )}
                  <p className="similar__title">{m.title}</p>
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