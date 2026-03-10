import { useState } from "react";
import { searchMovies } from "../features/services/movieService";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);

  const navigate = useNavigate();
  const searchRef = useRef(null);

  //search api
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      const results = await searchMovies(value);
      setMovies(results);
    } else {
      setMovies([]);
    }
  };

  // 👇 Detect click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setMovies([]);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div className="search" ref={searchRef}>
      <input
        type="text"
        placeholder="Titles, people, genres"
        value={query}
        onChange={handleSearch}
      />

      {movies.length > 0 && (
        <div className="search-results">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="search-item"
              onClick={() => {
                navigate(`/title/movie/${movie.id}`);
                setMovies([]);
                setQuery("");
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                onError={(e) => {
                  e.target.src = "/no-image.png";
                }}
              />

              <div className="movie-info">
                <p className="title">{movie.title}</p>
                <span className="year">
                  {movie.release_date?.split("-")[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
