import React, { Suspense } from "react";
import { motion } from "framer-motion";
import {
  XMarkIcon,
  HeartIcon,
  MapPinIcon,
  CalendarIcon,
  FilmIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { Character } from "../../../shared/types/api.types";
import { useCharacter } from "../hooks/useCharacters";
import { DetailSkeleton } from "../../../shared/components/Skeleton";
import { ErrorBoundary } from "../../../shared/components/ErrorBoundary";
import {
  formatDate,
  capitalizeWords,
} from "../../../shared/utils/format.utils";
import { EpisodeList } from "../../episodes/components/EpisodeList";

interface CharacterDetailProps {
  characterId: number | null;
  isFavorite?: boolean;
  onClose: () => void;
  onToggleFavorite?: (character: Character) => void;
  className?: string;
}

const statusColors = {
  Alive: "text-green-600 bg-green-100 dark:bg-green-900/30",
  Dead: "text-red-600 bg-red-100 dark:bg-red-900/30",
  unknown: "text-gray-600 bg-gray-100 dark:bg-gray-900/30",
};

const genderEmojis = {
  Male: "👨",
  Female: "👩",
  Genderless: "🤖",
  unknown: "❓",
};

export const CharacterDetail: React.FC<CharacterDetailProps> = ({
  characterId,
  isFavorite = false,
  onClose,
  onToggleFavorite,
  className = "",
}) => {
  const { data: character, isLoading, error } = useCharacter(characterId);

  if (!characterId) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">👋</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Select a Character
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Choose a character from the list to see their details
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <DetailSkeleton className={className} />;
  }

  if (error || !character) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">😵</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Character Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Sorry, we couldn't load this character's details
          </p>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    onToggleFavorite?.(character);
  };

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ duration: 0.3 }}
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden h-full flex flex-col ${className}`}>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">
                  {genderEmojis[character.gender]}
                </span>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {character.name}
                  </h1>
                  <p className="text-primary-100">
                    {character.species}
                    {character.type && (
                      <span className="text-primary-200 ml-1">
                        ({character.type})
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {onToggleFavorite && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleToggleFavorite}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                    {isFavorite ? (
                      <HeartSolidIcon className="h-6 w-6 text-red-400" />
                    ) : (
                      <HeartIcon className="h-6 w-6 text-white" />
                    )}
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                  <XMarkIcon className="h-6 w-6 text-white" />
                </motion.button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusColors[character.status]
                }`}>
                {character.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col items-center space-y-4">
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  src={character.image}
                  alt={character.name}
                  className="w-48 h-48 rounded-lg shadow-lg object-cover"
                />

                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Episodes
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {character.episode.length}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Gender
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {capitalizeWords(character.gender)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPinIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Origin
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 break-words">
                    {character.origin.name}
                  </p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPinIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Last Known Location
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 break-words">
                    {character.location.name}
                  </p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      First Seen
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {formatDate(character.created)}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center space-x-2 mb-4">
                  <FilmIcon className="h-6 w-6 text-gray-500" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Episodes ({character.episode.length})
                  </h3>
                </div>

                <Suspense
                  fallback={
                    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-lg" />
                  }>
                  <EpisodeList
                    episodeUrls={character.episode.slice(0, 10)}
                    compact
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </ErrorBoundary>
  );
};

export const CharacterDetailWithSuspense: React.FC<CharacterDetailProps> = (
  props
) => (
  <Suspense fallback={<DetailSkeleton />}>
    <CharacterDetail {...props} />
  </Suspense>
);

export default CharacterDetail;
