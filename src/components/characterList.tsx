import React, { FC, ReactNode } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Skeleton from "./Skeleton";

export interface CharacterType {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
}

interface CharacterListProps {
  characters: CharacterType[];
  isLoading: boolean;
  onSelectCharacter: (id: number) => void;
  selectedId: number | null;
}

const CharacterList: FC<CharacterListProps> = ({
  characters,
  isLoading,
  onSelectCharacter,
  selectedId,
}) => {
  if (isLoading) {
    return (
      <div className="characters-list">
        <Skeleton type="list" />
      </div>
    );
  }

  return (
    <div className="characters-list">
      {characters.map((character) => (
        <Character key={character.id} item={character}>
          <button
            className="icon red"
            onClick={() => onSelectCharacter(character.id)}
            aria-label="Select Character"
          >
            {selectedId === character.id ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
        </Character>
      ))}
    </div>
  );
};

export default CharacterList;

interface CharacterProps {
  item: CharacterType;
  children: ReactNode;
}

export const Character: FC<CharacterProps> = ({ item, children }) => (
  <div className="list__item">
    <img src={item.image} alt={item.name} />
    <CharacterName item={item} />
    <CharacterInfo item={item} />
    {children}
  </div>
);

interface CharacterNameProps {
  item: CharacterType;
}

const CharacterName: FC<CharacterNameProps> = ({ item }) => (
  <h3 className="name">
    <span>{item.gender === "Male" ? "👨🏻‍🦱" : "👩🏻‍🦱"}</span>
    <span>{item.name}</span>
  </h3>
);

interface CharacterInfoProps {
  item: CharacterType;
}

const CharacterInfo: FC<CharacterInfoProps> = ({ item }) => (
  <div className="list-item__info info">
    <span className={`status ${item.status === "Dead" ? "red" : ""}`}></span>
    <span> {item.status} </span>
    <span> - {item.species}</span>
  </div>
);
