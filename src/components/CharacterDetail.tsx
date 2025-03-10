import React, { useEffect, useState, useMemo, FC } from "react";
import { ArrowUpCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Skeleton from "./Skeleton";
import toast from "react-hot-toast";

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  location: { name: string };
  episode: string[];
}

interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  created: string;
}

interface CharacterDetailProps {
  selectedId: number | null;
  onAddFavorite: (char: Character) => void;
  isAddToFavorite: boolean;
  onCloseSelectedCharacter: () => void;
}

export const CharacterDetail: FC<CharacterDetailProps> = ({
  selectedId,
  onAddFavorite,
  isAddToFavorite,
  onCloseSelectedCharacter,
}) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedId) return;
      setIsLoading(true);
      try {
        const { data: characterData } = await axios.get<Character>(
          `https://rickandmortyapi.com/api/character/${selectedId}`
        );
        setCharacter(characterData);

        const episodesId = characterData.episode.map((url) =>
          url.split("/").pop()
        );
        const { data: episodeData } = await axios.get<Episode[]>(
          `https://rickandmortyapi.com/api/episode/${episodesId}`
        );
        // Normalize the episodeData to an array and take the first five episodes.
        setEpisodes(Array.isArray(episodeData) ? episodeData.slice(0, 5) : [episodeData]);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
          toast.error(err.response.data.error);
        } else {
          toast.error("An unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedId]);

  if (isLoading) return <Skeleton type="detail" />;
  if (!selectedId || !character) return <SelectCharacterPrompt />;

  return (
    <div style={{ flex: 1 }}>
      <CharacterSubInfo
        character={character}
        onAddFavorite={onAddFavorite}
        isAddToFavorite={isAddToFavorite}
        onCloseSelectedCharacter={onCloseSelectedCharacter}
      />
      <EpisodeList episodes={episodes} />
    </div>
  );
};

const SelectCharacterPrompt: FC = () => (
  <div
    className="character-detail__container"
    style={{ flex: 1, color: "var(--slate-300)" }}
  >
    <div className="select-character-prompt">
      <p className="select-character-text">Please select a character.</p>
      <div className="select-character-card">
        <p className="select-character-info">
          Explore the list and click on a character to see more details.
        </p>
      </div>
    </div>
  </div>
);

interface CharacterSubInfoProps {
  character: Character;
  onAddFavorite: (char: Character) => void;
  isAddToFavorite: boolean;
  onCloseSelectedCharacter: () => void;
}

const CharacterSubInfo: FC<CharacterSubInfoProps> = ({
  character,
  onAddFavorite,
  isAddToFavorite,
  onCloseSelectedCharacter,
}) => {
  return (
    <div className="character-detail">
      <img
        src={character.image}
        alt={character.name}
        className="character-detail__img"
      />
      <div className="character-detail__info" style={{ width: "100%" }}>
        <h3
          className="name"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span>{character.gender === "Male" ? "👨🏻‍🦱" : "👩🏻‍🦱"}</span>
            <span>&nbsp;{character.name}</span>
          </div>
          <button onClick={onCloseSelectedCharacter}>
            <XCircleIcon
              className="icon close"
              style={{ color: "var(--rose-500)" }}
            />
          </button>
        </h3>
        <div className="info">
          <span
            className={`status ${character.status === "Dead" ? "red" : ""}`}
          ></span>
          <span>&nbsp;{character.status}</span>
          <span> - &nbsp;{character.species}</span>
        </div>
        <div className="location">
          <p>Last known location:</p>
          <p>{character.location.name}</p>
        </div>
        <div className="actions">
          {isAddToFavorite ? (
            <p>Already Added To Favorites✅</p>
          ) : (
            <button
              className="btn btn--primary"
              onClick={() => onAddFavorite(character)}
            >
              Add to Favorite
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface EpisodeListProps {
  episodes: Episode[];
}

const EpisodeList: FC<EpisodeListProps> = ({ episodes }) => {
  const [sortByAsc, setSortByAsc] = useState(true);

  const sortedEpisodes = useMemo(() => {
    return [...episodes].sort((a, b) =>
      sortByAsc
        ? new Date(a.created).getTime() - new Date(b.created).getTime()
        : new Date(b.created).getTime() - new Date(a.created).getTime()
    );
  }, [episodes, sortByAsc]);

  return (
    <div className="character-episodes">
      <div className="title">
        <h2>List of Episodes:</h2>
        <button onClick={() => setSortByAsc((prev) => !prev)}>
          <ArrowUpCircleIcon
            className="icon"
            style={{ transform: sortByAsc ? "rotate(0deg)" : "rotate(180deg)" }}
          />
        </button>
      </div>
      <ul>
        {sortedEpisodes.map((item, index) => (
          <li key={item.id}>
            <div>
              {String(index + 1).padStart(2, "0")}-{item.episode} : &nbsp;
              <strong>{item.name}</strong>
            </div>
            <div className="badge badge--secondary">{item.air_date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CharacterDetail;

