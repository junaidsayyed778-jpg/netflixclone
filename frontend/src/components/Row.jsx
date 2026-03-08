import useMovies from "../features/hooks/useMovies";
import MovieCard from "./MovieCard";

const Row = ({ title, type }) => {

  const movies = useMovies(type);

  return (
    <div className="row">

      <h2>{title}</h2>

      <div className="row__movies">

        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}

      </div>

    </div>
  );
};

export default Row;