import React from "react";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { Character } from "../../../shared/types/api.types";
import { formatDate } from "../../../shared/utils/format.utils";

interface CharacterCardProps {
  character: Character;
  isSelected?: boolean;
  isFavorite?: boolean;
  onSelect?: (id: number) => void;
  onToggleFavorite?: (character: Character) => void;
  className?: string;
}

const statusColors = {
  Alive: "bg-green-500",
  Dead: "bg-red-500",
  unknown: "bg-gray-500",
};

const genderEmojis = {
  Male: "👨",
  Female: "👩",
  Genderless: "🤖",
  unknown: "❓",
};

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isSelected = false,
  isFavorite = false,
  onSelect,
  onToggleFavorite,
  className = "",
}) => {
  const handleSelect = () => {
    onSelect?.(character.id);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(character);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className={`
        relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl 
        transition-all duration-300 overflow-hidden cursor-pointer group
        ${isSelected ? "ring-2 ring-primary-500" : ""}
        ${className}
      `}
      onClick={handleSelect}>
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Status Indicator */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${statusColors[character.status]}`}
          />
          <span className="text-xs font-medium text-white bg-black/50 px-2 py-1 rounded-full">
            {character.status}
          </span>
        </div>

        {/* Favorite Button */}
        {onToggleFavorite && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors">
            {isFavorite ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </motion.button>
        )}

        {/* Select Button */}
        {onSelect && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSelect}
            className="absolute bottom-3 right-3 p-2 bg-primary-600 text-white rounded-full shadow-md hover:bg-primary-700 transition-colors">
            {isSelected ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </motion.button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name and Gender */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {character.name}
          </h3>
          <span className="text-xl" title={character.gender}>
            {genderEmojis[character.gender]}
          </span>
        </div>

        {/* Species */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          {character.species}
          {character.type && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              ({character.type})
            </span>
          )}
        </p>

        {/* Location */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Last known location:
          </p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
            {character.location.name}
          </p>
        </div>

        {/* Episodes Count */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{character.episode.length} episodes</span>
          <span title={`Created: ${formatDate(character.created)}`}>
            {formatDate(character.created)}
          </span>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default CharacterCard;
