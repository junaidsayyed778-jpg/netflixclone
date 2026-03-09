import { useRef } from "react";
import MovieCard from "./MovieCard";
import useMovies from "../features/hooks/useMovies";

const Row = ({ title, type }) => {
  const { movies, loadMore } = useMovies(type);
  const rowRef = useRef();

  const handleScroll = () => {
    const { scrollLeft, clientWidth, scrollWidth } = rowRef.current;
    if (scrollLeft + clientWidth >= scrollWidth - 100) {
      loadMore(); // fetch next page
    }
  };

  return (
    <section className="row">
      <h2 className="row__title">{title}</h2>
      <div
        ref={rowRef}
        className="row__movies"
        onScroll={handleScroll}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default Row;