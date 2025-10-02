import React, { useState, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "./shared/components/ErrorBoundary";
import { Layout, Container, Main, Sidebar } from "./shared/components/Layout";
import { SearchBar } from "./shared/components/SearchBar";
import { LoadingSpinner } from "./shared/components/LoadingSpinner";
import { CharacterList } from "./domains/characters/components/CharacterList";
import { CharacterDetail } from "./domains/characters/components/CharacterDetail";
import { useCharacters } from "./domains/characters/hooks/useCharacters";
import { useLocalStorage } from "./shared/hooks/useLocalStorage";
import { Character } from "./shared/types/api.types";
import { Navbar } from "./components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

import "./index.css";

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(
    null
  );
  const [showDetail, setShowDetail] = useState(false);

  const [favorites, setFavorites] = useLocalStorage<Character[]>(
    "rick-morty-favorites",
    []
  );
  const {
    data: charactersResponse,
    isLoading,
    error,
  } = useCharacters({
    name: searchQuery || undefined,
    page: currentPage,
  });

  const characters = charactersResponse?.results || [];
  const totalPages = charactersResponse?.info.pages || 1;

  const handleSelectCharacter = (id: number) => {
    setSelectedCharacterId(id);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setSelectedCharacterId(null);
    setShowDetail(false);
  };

  const handleToggleFavorite = (character: Character) => {
    setFavorites((prev) => {
      const isAlreadyFavorite = prev.some((fav) => fav.id === character.id);
      if (isAlreadyFavorite) {
        return prev.filter((fav) => fav.id !== character.id);
      } else {
        return [...prev, character];
      }
    });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const favoriteIds = favorites.map((fav) => fav.id);

  return (
    <ErrorBoundary>
      <Layout>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: "dark:bg-gray-800 dark:text-white",
          }}
        />

        <Navbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          favorites={favorites}
          onRemoveFavorite={(id) =>
            setFavorites((prev) => prev.filter((fav) => fav.id !== id))
          }
          resultsCount={characters.length}
        />

        <Container className="py-6">
          <div className="flex gap-6 h-[calc(100vh-140px)] relative">
            <div
              className={`flex-1 overflow-hidden transition-all duration-300 ${
                showDetail ? "lg:mr-80" : ""
              }`}>
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-64">
                    <LoadingSpinner size="lg" />
                  </div>
                }>
                <CharacterList
                  characters={characters}
                  isLoading={isLoading}
                  selectedId={selectedCharacterId}
                  favorites={favoriteIds}
                  onSelectCharacter={handleSelectCharacter}
                  onToggleFavorite={handleToggleFavorite}
                  className="h-full overflow-y-auto pr-4"
                />
              </Suspense>

              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center space-x-2 mt-6">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1 || isLoading}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Previous
                  </button>

                  <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages || isLoading}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Next
                  </button>
                </motion.div>
              )}
            </div>

            <AnimatePresence>
              {showDetail && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleCloseDetail}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                  />

                  <motion.div
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed lg:absolute top-0 right-0 w-full lg:w-80 h-full bg-white dark:bg-gray-800 shadow-xl z-50 lg:z-auto overflow-hidden">
                    <Suspense
                      fallback={
                        <div className="flex items-center justify-center h-64">
                          <LoadingSpinner size="lg" />
                        </div>
                      }>
                      <CharacterDetail
                        characterId={selectedCharacterId}
                        isFavorite={
                          selectedCharacterId
                            ? favoriteIds.includes(selectedCharacterId)
                            : false
                        }
                        onClose={handleCloseDetail}
                        onToggleFavorite={handleToggleFavorite}
                        className="h-full"
                      />
                    </Suspense>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </Container>
      </Layout>
    </ErrorBoundary>
  );
};

export default App;
