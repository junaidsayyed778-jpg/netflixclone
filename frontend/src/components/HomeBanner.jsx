import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Row from "../components/Row";
import SkeletonRow from "../components/SkeletonRow";
import { fetchMovies, searchMovies, clearMovieCache } from "../features/services/movieService";

const SECTIONS = [
  { id: "trending", title: "🔥 Trending Now", type: "trending" },
  { id: "popular", title: "⭐ Popular Movies", type: "popular" },
  { id: "top_rated", title: "🏆 Top Rated", type: "top_rated" },
  { id: "upcoming", title: "🎬 Upcoming Releases", type: "upcoming" },
  { id: "now_playing", title: "🎥 Now Playing in Theaters", type: "now_playing" },
];

const HomeBanner = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [movies, setMovies] = useState({});
  const [error, setError] = useState(null);

  // ───────────────────────────────────────────────────
  // Load All Movie Sections on Mount
  // ───────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const loadAllMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const results = await Promise.allSettled(
          SECTIONS.map(section => fetchMovies(section.type))
        );

        if (isMounted) {
          const moviesData = {};
          SECTIONS.forEach((section, index) => {
            if (results[index].status === "fulfilled") {
              moviesData[section.id] = results[index].value;
            } else {
              console.error(`Failed to load ${section.type}:`, results[index].reason);
              moviesData[section.id] = [];
            }
          });
          
          setMovies(moviesData);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load movies:", err);
        if (isMounted) {
          setError("Unable to load movies. Please check your connection.");
          setLoading(false);
        }
      }
    };

    loadAllMovies();
    return () => { isMounted = false; };
  }, []);

  // ───────────────────────────────────────────────────
  // Handle Search (Debounced) - For Header Search
  // ───────────────────────────────────────────────────
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchMovies(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error("Search failed:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ───────────────────────────────────────────────────
  // Refresh Data
  // ───────────────────────────────────────────────────
  const handleRefresh = async () => {
    clearMovieCache();
    setLoading(true);
    
    const results = await Promise.allSettled(
      SECTIONS.map(section => fetchMovies(section.type))
    );
    
    const moviesData = {};
    SECTIONS.forEach((section, index) => {
      moviesData[section.id] = results[index].status === "fulfilled" 
        ? results[index].value 
        : [];
    });
    
    setMovies(moviesData);
    setLoading(false);
  };

  // ───────────────────────────────────────────────────
  // Loading State: Show Skeletons
  // ───────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="home home--loading">
        <div className="home__loader">
          {SECTIONS.map(section => (
            <SkeletonRow key={section.id} title={section.title} />
          ))}
        </div>
      </main>
    );
  }

  // ───────────────────────────────────────────────────
  // Error State
  // ───────────────────────────────────────────────────
  if (error) {
    return (
      <main className="home home--error">
        <div className="error__container">
          <div className="error__icon">⚠️</div>
          <h2 className="error__title">Something went wrong</h2>
          <p className="error__message">{error}</p>
          <div className="error__actions">
            <button className="btn btn--primary" onClick={handleRefresh}>
              🔄 Try Again
            </button>
            <button className="btn btn--secondary" onClick={() => navigate("/")}>
              🏠 Go Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ───────────────────────────────────────────────────
  // Search Results View (Triggered from Header)
  // ───────────────────────────────────────────────────
  if (searchQuery.trim() && !isSearching) {
    return (
      <main className="home home--search-results">
        
        {/* Search Results Header */}
        <div className="search-results__header">
          <div className="search-results__content">
            <h2 className="search-results__title">
              🔍 Results for "{searchQuery}"
            </h2>
            <span className="search-results__count">
              {searchResults.length} {searchResults.length === 1 ? 'movie' : 'movies'} found
            </span>
          </div>
          <button 
            className="search-results__clear btn btn--ghost" 
            onClick={() => setSearchQuery("")}
          >
            ✕ Clear
          </button>
        </div>
        
        {/* Search Results Row */}
        {searchResults.length > 0 ? (
          <Row 
            title="" 
            movies={searchResults} 
            type="search"
            className="row--search-results"
          />
        ) : (
          <div className="empty-results">
            <div className="empty-results__icon">😕</div>
            <p className="empty-results__title">No movies found</p>
            <p className="empty-results__message">
              We couldn't find anything for <strong>"{searchQuery}"</strong>
            </p>
            <p className="empty-results__hint">
              💡 Try: "action", "comedy", "Marvel", or movie titles
            </p>
          </div>
        )}
        
        {/* Fallback: Popular Movies */}
        {movies.popular?.length > 0 && searchResults.length > 0 && (
          <>
            <div className="section-divider" />
            <Row 
              title="⭐ You Might Also Like" 
              movies={movies.popular.slice(0, 10)} 
              type="popular"
            />
          </>
        )}
      </main>
    );
  }

  // ───────────────────────────────────────────────────
  // Main View: All Movie Sections (NO Search Bar)
  // ───────────────────────────────────────────────────
  return (
    <main className="home">
      
      {/* 🎬 Movie Sections - Starts below fixed header */}
      <div className="home__sections">
        {SECTIONS.map(section => {
          const sectionMovies = movies[section.id] || [];
          
          // Skip empty sections (optional)
          if (sectionMovies.length === 0) return null;
          
          return (
            <section 
              key={section.id} 
              className="home__section"
              id={`section-${section.id}`}
            >
              <Row
                title={section.title}
                movies={sectionMovies}
                type={section.type}
                className={`row--${section.type}`}
              />
            </section>
          );
        })}
      </div>

      {/* 💡 Footer Hint */}
      <footer className="home__footer">
        <div className="home__footer-content">
          <span className="home__footer-icon">💡</span>
          <p className="home__footer-text">
            Click any movie poster to see details, trailer & more!
          </p>
        </div>
      </footer>

      {/* ⬆️ Scroll to Top Button */}
      <button 
        className="home__scroll-top" 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        ↑
      </button>

    </main>
  );
};

export default HomeBanner;