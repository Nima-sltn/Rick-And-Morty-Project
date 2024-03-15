import "./App.css";
import Navbar, { Favorites, Search, SearchResult } from "./components/Navbar";
import CharacterList from "./components/characterList";
import CharacterDetail from "./components/CharacterDetail";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import useCharacters from "./hooks/useCharacters";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const [query, setQuery] = useState("");
  const { isLoading, characters } = useCharacters(query);
  const [selectedId, setSelectedId] = useState(null);
  const [favorite, setFavorite] = useLocalStorage("FAVORITES", []);
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
