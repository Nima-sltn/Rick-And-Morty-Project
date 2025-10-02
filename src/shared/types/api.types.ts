export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface ApiResponse<T> {
  info: ApiInfo;
  results: T[];
}

export interface ApiError {
  error: string;
}

export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

export interface LocationReference {
  name: string;
  url: string;
}

export type CharacterStatus = "Alive" | "Dead" | "unknown";
export type CharacterGender = "Male" | "Female" | "Genderless" | "unknown";

export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: CharacterGender;
  origin: LocationReference;
  location: LocationReference;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

export interface SearchFilters {
  name?: string;
  status?: CharacterStatus;
  species?: string;
  gender?: CharacterGender;
  page?: number;
}

export interface LocationFilters {
  name?: string;
  type?: string;
  dimension?: string;
  page?: number;
}

export interface EpisodeFilters {
  name?: string;
  episode?: string;
  page?: number;
}
