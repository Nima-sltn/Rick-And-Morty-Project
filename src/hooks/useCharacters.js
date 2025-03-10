import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function useCharacters(query, page) {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character?name=${query}&page=${page}`,
          { signal }
        );
        setCharacters(data.results.slice(0, 5));
        setTotalPages(Math.ceil(data.info.pages));
      } catch (err) {
        if (!axios.isCancel()) {
          setCharacters([]);
          setTotalPages(1); // Reset total pages if there's an error
          toast.error(err.response.data.error);
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
