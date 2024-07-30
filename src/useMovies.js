import debounce from "lodash.debounce";
import { useState, useEffect, useCallback } from "react";
const KEY = "cdb6401f";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMovies = useCallback(debounce(async (query, controller) => {
    try {
      setIsLoading(true);
      setError("");
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
        { controller: controller.signal }
      );

      if (!res.ok)
        throw new Error("Something went wrong with fetching movies");

      const data = await res.json();

      if (data.Response === "False") throw new Error("Movie not found");

      setMovies(data.Search);
      setError("");
    } catch (err) {
      if (err.name !== "AbortError") {
        console.log(err.message);
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, 500), [])
  useEffect(() => {
    const controller = new AbortController();
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    // handleCloseMovie();
    fetchMovies(query, controller);
    return () => controller.abort();
  }, [query]);
  return { movies, isLoading, error };
}
