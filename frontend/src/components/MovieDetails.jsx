import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieDetails, getMovieRecommendations } from "../features/services/movieService";

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie ] = useState(null); 
    const [recommendations, setRecommendations] = useState([]);

    useEffect(()=>{
        const loadData = async () => {
            const details = await getMovieDetails(id)
            const recs = await getMovieRecommendations(id)

            setMovie(details)
            setRecommendations(recs)
        }

        loadData();
    }, [id])

    if(!movie) return <h2>loading...</h2>

     return (
    <div className="movie-page">

      <h1>{movie.title}</h1>

      <p>{movie.overview}</p>

      <h2>More Like This</h2>

      <div className="movie-grid">

        {recommendations.map((m) => (

          <div
            key={m.id}
            className="movie-card"
            onClick={() => navigate(`/title/movie/${m.id}`)}
          >

            <img
              src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
            />

            <p>{m.title}</p>

          </div>

        ))}

      </div>

    </div>
  );

}

export default MovieDetails