import React, { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Character } from "../../../shared/types/api.types";
import { CharacterCard } from "./CharacterCard";
import { GridSkeleton } from "../../../shared/components/Skeleton";
import { ErrorBoundary } from "../../../shared/components/ErrorBoundary";

interface CharacterListProps {
  characters: Character[];
  isLoading?: boolean;
  selectedId?: number | null;
  favorites?: number[];
  onSelectCharacter?: (id: number) => void;
  onToggleFavorite?: (character: Character) => void;
  className?: string;
  layout?: "grid" | "list";
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export const CharacterList: React.FC<CharacterListProps> = ({
  characters,
  isLoading = false,
  selectedId,
  favorites = [],
  onSelectCharacter,
  onToggleFavorite,
  className = "",
  layout = "grid",
}) => {
  if (isLoading) {
    return (
      <div className={className}>
        <GridSkeleton count={12} columns={layout === "grid" ? 4 : 1} />
      </div>
    );
  }

  if (!characters || characters.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No characters found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Try adjusting your search criteria or filters
          </p>
        </div>
      </div>
    );
  }

  const gridClasses =
    layout === "grid"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      : "space-y-4";

  return (
    <ErrorBoundary>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`${gridClasses} ${className}`}>
        <AnimatePresence mode="popLayout">
          {characters.map((character) => (
            <motion.div
              key={character.id}
              variants={itemVariants}
              layout
              layoutId={`character-${character.id}`}>
              <CharacterCard
                character={character}
                isSelected={selectedId === character.id}
                isFavorite={favorites.includes(character.id)}
                onSelect={onSelectCharacter}
                onToggleFavorite={onToggleFavorite}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </ErrorBoundary>
  );
};

export const CharacterListWithSuspense: React.FC<CharacterListProps> = (
  props
) => (
  <Suspense fallback={<GridSkeleton count={12} />}>
    <CharacterList {...props} />
  </Suspense>
);

export default CharacterList;
