const MovieCard = ({ movie }) => {

  const IMG_URL = "https://image.tmdb.org/t/p/w300";

  return (
    <div className="movieCard">

      <div className="movieCard__imageWrapper">
        <img
          className="movieCard__image"
          src={`${IMG_URL}${movie.poster_path}`}
          alt={movie.title || movie.name}
        />
      </div>

      <p className="movieCard__title">
        {movie.title || movie.name}
      </p>

    </div>
  );
};

export default MovieCard;