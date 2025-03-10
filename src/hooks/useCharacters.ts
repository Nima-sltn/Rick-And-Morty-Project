import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
}

interface ApiResponse {
  info: { pages: number };
  results: Character[];
}

export default function useCharacters(query: string, page: number) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get<ApiResponse>(
          `https://rickandmortyapi.com/api/character?name=${query}&page=${page}`,
          { signal }
        );
        // Limit the results to the first 5 characters
        setCharacters(data.results.slice(0, 5));
        // Set total pages (using Math.ceil in case pages is a float)
        setTotalPages(Math.ceil(data.info.pages));
      } catch (error: unknown) {
        if (!axios.isCancel(error)) {
          setCharacters([]);
          setTotalPages(1); // Reset total pages if there's an error
          if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.error || "An error occurred");
          } else {
            toast.error("An unexpected error occurred");
          }
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [query, page]);

  return { isLoading, characters, totalPages };
}
