import { useEffect, useState, useRef } from "react";
import { fetchMovies } from "../services/movieService";

const useMovies = (type) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);

  const loadMovies = async () => {
    const data = await fetchMovies(type, page);
    setMovies((prev) => [...prev, ...data]);
  };

  useEffect(() => {
    loadMovies();
  }, [page, type]);

  const loadMore = () => setPage((prev) => prev + 1);

  return { movies, loadMore };
};

export default useMovies;