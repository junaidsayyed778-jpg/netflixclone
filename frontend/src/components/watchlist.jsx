import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../features/hooks/useAuth";
import { getWatchlist, removeFromWatchlist } from "../features/services/watchlistServices";

const Watchlist = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  // ───────────────────────────────────────────────────
  // Fetch Watchlist on Mount
  // ───────────────────────────────────────────────────
  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await getWatchlist();
      // Handle different response formats
      const watchlistData = res.data?.watchlist || res.data?.movies || res.data || [];
      setMovies(watchlistData);
      
    } catch (err) {
      console.error("Error fetching watchlist:", err);
      setError(err.response?.data?.message || "Failed to load watchlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate("/login", { state: { from: "/watchlist" } });
      return;
    }
    
    fetchWatchlist();
  }, [user, navigate]);

  // ───────────────────────────────────────────────────
  // Remove Movie from Watchlist
  // ───────────────────────────────────────────────────
  const handleRemove = async (movieId, e) => {
    e?.stopPropagation(); // Prevent card click
    setRemovingId(movieId);

    try {
      await removeFromWatchlist(movieId);
      
      // Optimistic update: remove from UI immediately
      setMovies((prev) => prev.filter((m) => m.movieId !== movieId && m.id !== movieId));
      
    } catch (err) {
      console.error("Error removing movie:", err);
      setError("Failed to remove movie. Please try again.");
      fetchWatchlist(); // Re-sync with backend
    } finally {
      setRemovingId(null);
    }
  };

  // ───────────────────────────────────────────────────
  // Loading State
  // ───────────────────────────────────────────────────
  if (loading) {
    return (
      <main style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: '#141414',
          padding: '40px 32px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            margin: '0 auto 16px',
            border: '3px solid rgba(255,255,255,0.2)',
            borderTopColor: '#e50914',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#b3b3b3', margin: 0 }}>Loading your watchlist...</p>
        </div>
      </main>
    );
  }

  // ───────────────────────────────────────────────────
  // Error State
  // ───────────────────────────────────────────────────
  if (error) {
    return (
      <main style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: '#141414',
          padding: '32px 24px',
          borderRadius: '8px',
          textAlign: 'center',
          maxWidth: '400px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>⚠️</div>
          <h2 style={{ color: '#fff', margin: '0 0 8px', fontSize: '1.4rem' }}>Unable to Load</h2>
          <p style={{ color: '#b3b3b3', margin: '0 0 20px' }}>{error}</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={fetchWatchlist}
              style={{
                padding: '10px 20px',
                background: '#e50914',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🔄 Try Again
            </button>
            <Link 
              to="/"
              style={{
                padding: '10px 20px',
                background: 'transparent',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.2)',
                borderRadius: '6px',
                fontWeight: '600',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              ← Browse Movies
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ───────────────────────────────────────────────────
  // Empty State
  // ───────────────────────────────────────────────────
  if (movies.length === 0) {
    return (
      <main style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: '#141414',
          padding: '40px 24px',
          borderRadius: '8px',
          textAlign: 'center',
          maxWidth: '400px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: '0.8' }}>🎬</div>
          <h2 style={{ color: '#fff', margin: '0 0 12px', fontSize: '1.4rem' }}>Your watchlist is empty</h2>
          <p style={{ color: '#b3b3b3', margin: '0 0 24px', lineHeight: '1.5' }}>
            Start adding movies you want to watch later!
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/"
              style={{
                padding: '12px 24px',
                background: '#e50914',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                textDecoration: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🔍 Browse Movies
            </Link>
            <button 
              onClick={() => navigate(-1)}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.2)',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              ← Go Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ───────────────────────────────────────────────────
  // Success: Render Watchlist (WITH INLINE STYLES)
  // ───────────────────────────────────────────────────
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#fff',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px'
      }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <h1 style={{ 
            fontSize: '1.8rem', 
            fontWeight: '700', 
            margin: 0,
            color: '#fff'
          }}>
            My Watchlist
          </h1>
          <span style={{
            color: '#b3b3b3',
            fontSize: '0.9rem',
            fontWeight: '500',
            background: 'rgba(255,255,255,0.1)',
            padding: '6px 14px',
            borderRadius: '20px'
          }}>
            {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
          </span>
        </div>

        {/* ✅ Movies Grid - INLINE STYLES (Grid Fixed!) */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '16px',
            padding: '8px 4px',
            width: '100%'
          }}
        >
        {movies.map((movie, index) => {  // ✅ Add index parameter here!
  const movieId = movie.movieId || movie.id;
  const title = movie.title || movie.name;
  const poster = movie.poster || movie.poster_path;
  
  // ✅ Always combine movieId + index for guaranteed uniqueness
  const key = movieId !== undefined ? `${movieId}-${index}` : `movie-${index}`;
    
            return (
              <article
                key={key}
                onClick={() => navigate(`/title/movie/${movieId}`)}
                style={{
                  background: '#141414',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  border: '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.6)';
                  e.currentTarget.style.borderColor = 'rgba(229,9,20,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                {/* Poster Image Wrapper */}
                <div style={{ 
                  position: 'relative', 
                  aspectRatio: '2/3', 
                  width: '100%',
                  background: 'linear-gradient(135deg, #2a2a2a, #1a1a1a)'
                }}>
                  {poster ? (
                    <img
                      // ✅ FIXED: Removed trailing spaces
                      src={`https://image.tmdb.org/t/p/w300${poster}`}
                      alt={title}
                      loading="lazy"
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.4s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
                      }}
                    />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      background: '#1a1a1a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#666',
                      fontSize: '0.8rem'
                    }}>
                      No Image
                    </div>
                  )}
                  
                  {/* Remove Button (Always Visible on Mobile, Hover on Desktop) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(movieId, e);
                    }}
                    disabled={removingId === movieId}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#e50914',
                      color: 'white',
                      border: 'none',
                      cursor: removingId === movieId ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      opacity: removingId === movieId ? 0.7 : 1,
                      transition: 'transform 0.2s ease, background 0.2s ease',
                      zIndex: 5
                    }}
                    onMouseEnter={(e) => {
                      if (removingId !== movieId) {
                        e.target.style.background = '#f40612';
                        e.target.style.transform = 'scale(1.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (removingId !== movieId) {
                        e.target.style.background = '#e50914';
                        e.target.style.transform = 'scale(1)';
                      }
                    }}
                    aria-label={`Remove ${title} from watchlist`}
                  >
                    {removingId === movieId ? (
                      <span style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: 'white',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                        display: 'inline-block'
                      }} />
                    ) : '✕'}
                  </button>
                </div>

                {/* Title Section */}
                <div style={{ padding: '10px 8px 8px' }}>
                  <h3 
                    title={title}
                    style={{ 
                      margin: 0, 
                      fontSize: '0.95rem', 
                      color: '#fff',
                      fontWeight: '600',
                      lineHeight: '1.3',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                      minHeight: '2.4rem'
                    }}
                  >
                    {title}
                  </h3>
                  
                  {/* Optional: Rating Badge */}
                  {movie.rating > 0 && (
                    <span style={{
                      display: 'inline-block',
                      marginTop: '4px',
                      fontSize: '0.75rem',
                      color: '#f5c518',
                      fontWeight: '600'
                    }}>
                      ⭐ {(movie.rating / 2).toFixed(1)}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => navigate(-1)}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ← Back
          </button>
          <Link 
            to="/"
            style={{
              padding: '12px 24px',
              background: '#e50914',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              textDecoration: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🔍 Discover More
          </Link>
        </div>

      </div>

      {/* Global Spinner Animation (for remove button) */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
};

export default Watchlist;