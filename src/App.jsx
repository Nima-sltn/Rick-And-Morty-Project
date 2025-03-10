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
  const [page, setPage] = useState(1);
  const { isLoading, characters, totalPages } = useCharacters(query, page);
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

  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = window.innerWidth < 768 ? 3 : 5; // Show up to 3 pages on mobile, 5 on larger screens
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={page === i ? "active" : ""}
          onClick={() => setPage(i)}
          disabled={isLoading}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

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
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1 || isLoading}>
            Previous
          </button>
          {renderPageNumbers()}
          <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages || isLoading}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

function Main({ children }) {
  return <div className="main">{children}</div>;
}
