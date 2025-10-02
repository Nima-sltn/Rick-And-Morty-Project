import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartIcon,
  SunIcon,
  MoonIcon,
  TrashIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { SearchBar } from "../shared/components/SearchBar";
import { useTheme } from "../shared/providers/ThemeProvider";
import { Character } from "../shared/types/api.types";
import { Modal } from "../shared/components/Modal";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  favorites: Character[];
  onRemoveFavorite: (id: number) => void;
  resultsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  favorites,
  onRemoveFavorite,
  resultsCount,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showFavorites, setShowFavorites] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3">
              <div className="text-2xl">🛸</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                Rick & Morty
              </div>
            </motion.div>

            <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-8">
              <SearchBar
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search characters..."
                className="flex-1"
              />

              <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {resultsCount} characters
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFavorites(true)}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {favorites.length > 0 ? (
                  <HeartSolidIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6" />
                )}
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {theme === "dark" ? (
                  <SunIcon className="h-6 w-6" />
                ) : (
                  <MoonIcon className="h-6 w-6" />
                )}
              </motion.button>
            </div>

            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}>
                  {isMobileMenuOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden border-t border-gray-200 dark:border-gray-700 overflow-hidden">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                  className="py-4 space-y-4">
                  <SearchBar
                    value={searchQuery}
                    onChange={(query) => {
                      onSearchChange(query);
                      if (query) {
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    placeholder="Search characters..."
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {resultsCount} characters
                    </span>

                    <div className="flex items-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setShowFavorites(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {favorites.length > 0 ? (
                          <HeartSolidIcon className="h-6 w-6 text-red-500" />
                        ) : (
                          <HeartIcon className="h-6 w-6" />
                        )}
                        {favorites.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {favorites.length}
                          </span>
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          toggleTheme();
                          setIsMobileMenuOpen(false);
                        }}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {theme === "dark" ? (
                          <SunIcon className="h-6 w-6" />
                        ) : (
                          <MoonIcon className="h-6 w-6" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <Modal
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
        title={`Favorites (${favorites.length})`}>
        {favorites.length === 0 ? (
          <div className="text-center py-8">
            <HeartIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">
              No favorites yet. Start adding characters you love!
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {favorites.map((character) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {character.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {character.species} • {character.status}
                  </p>
                </div>
                <button
                  onClick={() => onRemoveFavorite(character.id)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
};

export default Navbar;
