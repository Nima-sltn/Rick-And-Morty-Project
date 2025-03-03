import "./App.css";
import Navbar, { Favorites, Search, SearchResult } from "./components/Navbar";
import CharacterList from "./components/characterList";
import CharacterDetail from "./components/CharacterDetail";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

import useCharacters from "./hooks/useCharacters";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const [query, setQuery] = useState("");
  const { isLoading, characters } = useCharacters(query);
  const [selectedId, setSelectedId] = useState(null);
  const [favorite, setFavorite] = useLocalStorage("FAVORITES", []);

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
          onCloseSelectedCharacter={() => setSelectedId(null)}
        />
      </Main>
    </div>
  );
}

export default App;

function Main({ children }) {
  return <div className="main">{children}</div>;
}
