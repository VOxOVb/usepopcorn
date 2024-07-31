import { useDebounce } from "@uidotdev/usehooks";
import { useState, useEffect } from "react";
const KEY = "cdb6401f";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceQuery = useDebounce(query, 350);
  
  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${debounceQuery}`,
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
    }
    if (debounceQuery.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    fetchMovies();
    return () => controller.abort();
  }, [debounceQuery]);
  return { movies, isLoading, error };
}
