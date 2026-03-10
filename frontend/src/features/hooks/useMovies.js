import { useEffect, useState } from "react";
import { fetchMovies } from "../services/movieService";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";

const useMovies = (type) => {

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);

  const { setLoading } = useContext(AuthContext);

  const loadMovies = async () => {

    try {

      setLoading(true);

      const data = await fetchMovies(type, page);

      setMovies((prev) => [...prev, ...data]);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    loadMovies();

  }, [page, type]);

  const loadMore = () => setPage((prev) => prev + 1);

  return { movies, loadMore };
};

export default useMovies;