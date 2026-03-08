import { useEffect, useState } from "react";
import { fetchMovies } from "../services/movieService";

const useMovies = (type) => {

  const [movies, setMovies] = useState([]);

  useEffect(() => {

    const getMovies = async () => {
      const data = await fetchMovies(type);
      setMovies(data);
    };

    getMovies();

  }, [type]);

  return movies;
};

export default useMovies;