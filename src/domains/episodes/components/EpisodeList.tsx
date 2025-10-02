import React from "react";
import { motion } from "framer-motion";
import { CalendarIcon, PlayIcon } from "@heroicons/react/24/outline";
import { Episode } from "../../../shared/types/api.types";
import { useEpisodesByUrls } from "../hooks/useEpisodes";
import {
  formatDate,
  formatEpisodeCode,
} from "../../../shared/utils/format.utils";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";

interface EpisodeListProps {
  episodeUrls?: string[];
  episodes?: Episode[];
  compact?: boolean;
  className?: string;
  onEpisodeSelect?: (episode: Episode) => void;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({
  episodeUrls = [],
  episodes: providedEpisodes,
  compact = false,
  className = "",
  onEpisodeSelect,
}) => {
  const {
    data: fetchedEpisodes,
    isLoading,
    error,
  } = useEpisodesByUrls(episodeUrls);

  const episodes = providedEpisodes || fetchedEpisodes || [];

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-red-600 dark:text-red-400">
          Failed to load episodes
        </p>
      </div>
    );
  }

  if (!episodes || episodes.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-4xl mb-2">📺</div>
        <p className="text-gray-600 dark:text-gray-300">No episodes found</p>
      </div>
    );
  }

  const sortedEpisodes = [...episodes].sort((a, b) => {
    return a.episode.localeCompare(b.episode);
  });

  if (compact) {
    return (
      <div className={`space-y-2 ${className}`}>
        {sortedEpisodes.map((episode, index) => (
          <motion.div
            key={episode.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 
              rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors
              ${onEpisodeSelect ? "cursor-pointer" : ""}
            `}
            onClick={() => onEpisodeSelect?.(episode)}>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                  {episode.episode}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                  {episode.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {episode.air_date}
                </p>
              </div>
            </div>
            {onEpisodeSelect && <PlayIcon className="h-4 w-4 text-gray-400" />}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {sortedEpisodes.map((episode, index) => (
        <motion.div
          key={episode.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4 }}
          className={`
            bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg 
            transition-all duration-300 overflow-hidden
            ${onEpisodeSelect ? "cursor-pointer" : ""}
          `}
          onClick={() => onEpisodeSelect?.(episode)}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded">
                {episode.episode}
              </span>
              {onEpisodeSelect && (
                <PlayIcon className="h-5 w-5 text-gray-400 hover:text-primary-600" />
              )}
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {episode.name}
            </h3>

            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-3">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {episode.air_date}
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>{formatEpisodeCode(episode.episode)}</p>
              <p className="mt-1">{episode.characters.length} characters</p>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Added {formatDate(episode.created)}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default EpisodeList;
