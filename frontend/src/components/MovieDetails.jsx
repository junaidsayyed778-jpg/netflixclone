import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getMovieDetails,
  getMovieRecommendations,
  getMovieTrailer
} from "../features/services/movieService";
import { addToWatchlist } from "../features/services/watchlistServices";


const MovieDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trailer, setTrailer] = useState(null);

  const IMG_URL = "https://image.tmdb.org/t/p/original";
  const POSTER_URL = "https://image.tmdb.org/t/p/w300";

  useEffect(() => {

    const loadData = async () => {
      try {

        const details = await getMovieDetails(id);
        const recs = await getMovieRecommendations(id);
        const trailerKey = await getMovieTrailer(id);

        setMovie(details);
        setRecommendations(recs);
        setTrailer(trailerKey);

      } catch (err) {
        console.error("Error loading movie:", err);
      }
    };

    loadData();

  }, [id]);



  const handleWatchlist = async () => {

    try {

      await addToWatchlist({
        movieId: movie.id,
        title: movie.title,
        poster: movie.poster_path
      });

      alert("Added to watchlist ✅");

    } catch (err) {
      console.log(err);
    }

  };



  const watchTrailer = () => {

    if (!trailer) {
      alert("Trailer not available");
      return;
    }

    window.open(`https://www.youtube.com/watch?v=${trailer}`);

  };



  if (!movie) return <h2 className="movieDetails__loading">Loading...</h2>;



  return (
    <div className="movieDetails">

      {/* HERO SECTION */}

      <div
        className="movieDetails__hero"
        style={{
          backgroundImage: `url(${IMG_URL}${movie.backdrop_path})`
        }}
      >

        <div className="movieDetails__overlay">

          <div className="movieDetails__content">

            <h1 className="movieDetails__title">
              {movie.title}
            </h1>

            <p className="movieDetails__overview">
              {movie.overview}
            </p>

            <div className="movieDetails__buttons">

              <button
                className="movieDetails__play"
                onClick={watchTrailer}
              >
                ▶ Watch Trailer
              </button>

              <button
                className="movieDetails__watchlist"
                onClick={handleWatchlist}
              >
                + Watchlist
              </button>

            </div>

          </div>

        </div>

      </div>



      {/* RECOMMENDATIONS */}

      <div className="movieDetails__recommendations">

        <h2 className="movieDetails__sectionTitle">
          More Like This
        </h2>

        <div className="movieDetails__grid">

          {recommendations.map((m) => (

            <div
              key={m.id}
              className="movieDetails__card"
              onClick={() => navigate(`/title/movie/${m.id}`)}
            >

              <img
                src={`${POSTER_URL}${m.poster_path}`}
                alt={m.title}
              />

              <p>{m.title}</p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default MovieDetails;