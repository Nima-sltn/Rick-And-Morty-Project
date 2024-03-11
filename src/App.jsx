import "./App.css";
import Navbar, { Favorites, Search, SearchResult } from "./components/Navbar";
import CharacterList from "./components/characterList";
import CharacterDetail from "./components/CharacterDetail";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function App() {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [favorite, setFavorite] = useState(
    () => JSON.parse(localStorage.getItem("FAVORITES")) || []
  );

  const handleSelectCharacter = (id) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };
  const handleAddFavorite = (char) => {
    setFavorite((preFav) => [...preFav, char]);
  };
  const handleDeleteFavorite = (id) => {
    setFavorite((preFav) => preFav.filter((fav) => fav.id !== id));
  };

  const isAddToFavorite = favorite.map((fav) => fav.id).includes(selectedId);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character?name=${query}`,
          { signal }
        );
        setCharacters(data.results.slice(0, 5));
      } catch (err) {
        if (!axios.isCancel()) {
          setCharacters([]);
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
  }, [query]);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       setIsLoading(true);
  //       const res = await fetch("https://rickandmortyapi.com/api/characterss");

  //       if (!res.ok) throw new Error("something went wrong");

  //       const data = await res.json();
  //       setCharacters(data.results.slice(0, 5));
  //     } catch (err) {
  //       toast.error(err.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   fetchData();
  // }, []);

  useEffect(() => {
    localStorage.setItem("FAVORITES", JSON.stringify(favorite));
  }, [favorite]);
  return (
    <>
      <div className="app">
        <Toaster />
        <Navbar>
          <Search query={query} setQuery={setQuery} />
          <SearchResult numOfResult={characters.length} />
          <Favorites
            favorite={favorite}
            onDeleteFavorite={handleDeleteFavorite}
          />
        </Navbar>
        <Main>
          <CharacterList
            selectedId={selectedId}
            characters={characters}
            isLoading={isLoading}
            onSelectCharacter={handleSelectCharacter}
          />
          <CharacterDetail
            selectedId={selectedId}
            onAddFavorite={handleAddFavorite}
            isAddToFavorite={isAddToFavorite}
          />
        </Main>
      </div>
    </>
  );
}

export default App;

function Main({ children }) {
  return <div className="main">{children}</div>;
}
