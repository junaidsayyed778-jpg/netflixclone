import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMovies } from "../features/services/movieService";

const List = ({ title, param }) => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchMovies(param).then((res) => setList(res.data.results));
  }, [param]);

  return (
    <div className="list">
      <div className="row">
        <h2 className="text-white title">{title}</h2>

        <div className="col">
          <div className="row__posters">
            {list.map((movie) => (
              <div
                key={movie.id}
                className="movieCard"
                onClick={() => {
                  console.log("clicked", movie.id);
                  navigate(`/title/movie/${movie.id}`);
                }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
