const MovieCard = ({ movie }) => {

  const IMG_URL = "https://image.tmdb.org/t/p/w300";

  return (
    <div className="movieCard">

      <img
        src={`${IMG_URL}${movie.poster_path}`}
        alt={movie.title || movie.name}
      />

      <p>{movie.title || movie.name}</p>

    </div>
  );
};

export default MovieCard;