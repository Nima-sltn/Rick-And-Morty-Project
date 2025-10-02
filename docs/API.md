# API Documentation

## Overview

This document describes the internal API structure and usage patterns for the Rick and Morty Explorer application.

## 🔌 Service Layer APIs

### Character Service

#### `CharacterService.getCharacters(filters)`

Fetches paginated list of characters with optional filters.

```typescript
interface SearchFilters {
  name?: string;
  status?: CharacterStatus;
  species?: string;
  gender?: CharacterGender;
  page?: number;
}

const characters = await characterService.getCharacters({
  name: "Rick",
  status: "Alive",
  page: 1,
});
```

#### `CharacterService.getCharacter(id)`

Fetches a single character by ID.

```typescript
const character = await characterService.getCharacter(1);
```

#### `CharacterService.getCharactersByIds(ids)`

Fetches multiple characters by their IDs.

```typescript
const characters = await characterService.getCharactersByIds([1, 2, 3]);
```

### Episode Service

#### `EpisodeService.getEpisodes(filters)`

Fetches paginated list of episodes.

```typescript
interface EpisodeFilters {
  name?: string;
  episode?: string;
  page?: number;
}

const episodes = await episodeService.getEpisodes({
  name: "Pilot",
  episode: "S01E01",
});
```

#### `EpisodeService.getEpisodesByUrls(urls)`

Fetches episodes by their API URLs (common pattern in Rick and Morty API).

```typescript
const episodes = await episodeService.getEpisodesByUrls([
  "https://rickandmortyapi.com/api/episode/1",
  "https://rickandmortyapi.com/api/episode/2",
]);
```

## 🪝 Hook APIs

### Character Hooks

#### `useCharacters(filters)`

React Query hook for fetching characters with caching.

```typescript
const { data, isLoading, error, refetch } = useCharacters({
  name: "Rick",
  page: 1,
});
```

#### `useCharacter(id)`

Hook for fetching a single character.

```typescript
const { data: character, isLoading, error } = useCharacter(1);
```

#### `useInfiniteCharacters(filters)`

Hook for infinite scrolling/pagination.

```typescript
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteCharacters({ name: "Rick" });
```

### Utility Hooks

#### `useLocalStorage(key, initialValue)`

Hook for managing localStorage with React state synchronization.

```typescript
const [favorites, setFavorites] = useLocalStorage<Character[]>("favorites", []);
```

#### `useDebounce(value, delay)`

Hook for debouncing values (useful for search inputs).

```typescript
const debouncedSearchTerm = useDebounce(searchTerm, 300);
```

#### `useOptimisticUpdate(options)`

Hook for optimistic UI updates.

```typescript
const { optimisticUpdate } = useOptimisticUpdate({
  queryKey: ["characters"],
  updateFn: (oldData, newData) => ({ ...oldData, ...newData }),
});
```

## 🧩 Component APIs

### CharacterCard

```typescript
interface CharacterCardProps {
  character: Character;
  isSelected?: boolean;
  isFavorite?: boolean;
  onSelect?: (id: number) => void;
  onToggleFavorite?: (character: Character) => void;
  className?: string;
}

<CharacterCard
  character={character}
  isSelected={selectedId === character.id}
  isFavorite={favorites.includes(character.id)}
  onSelect={handleSelect}
  onToggleFavorite={handleToggleFavorite}
/>;
```

### CharacterList

```typescript
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

<CharacterList
  characters={characters}
  isLoading={isLoading}
  selectedId={selectedId}
  favorites={favoriteIds}
  onSelectCharacter={handleSelect}
  onToggleFavorite={handleToggleFavorite}
  layout="grid"
/>;
```

### SearchBar

```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  onClear?: () => void;
  autoFocus?: boolean;
}

<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search characters..."
  debounceMs={300}
  autoFocus
/>;
```

### Modal

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Character Details">
  <CharacterDetail character={character} />
</Modal>;
```

## 🎨 Theme API

### ThemeProvider

```typescript
const { theme, toggleTheme } = useTheme();

// Available themes: 'light' | 'dark'
// toggleTheme() switches between themes
```

### Theme Classes

The application uses Tailwind CSS with dark mode support:

```css
/* Light mode */
.bg-white .text-gray-900

/* Dark mode */
.dark:bg-gray-800 .dark:text-white
```

## 🔧 Utility APIs

### Storage Utils

```typescript
import { storage } from "../shared/utils/storage.utils";

// Get item with type safety
const data = storage.get<MyType>("key", defaultValue);

// Set item
storage.set("key", data);

// Remove item
storage.remove("key");

// Check availability
if (storage.isAvailable()) {
  // localStorage is available
}
```

### Format Utils

```typescript
import {
  formatDate,
  formatRelativeTime,
  capitalizeWords,
  truncateText,
} from "../shared/utils/format.utils";

const formatted = formatDate("2023-01-01T00:00:00Z"); // "January 1, 2023"
const relative = formatRelativeTime("2023-01-01T00:00:00Z"); // "2 hours ago"
const capitalized = capitalizeWords("rick sanchez"); // "Rick Sanchez"
const truncated = truncateText("Long text...", 50); // "Long text..."
```

## 📊 Query Keys

### Character Query Keys

```typescript
export const characterKeys = {
  all: ["characters"] as const,
  lists: () => [...characterKeys.all, "list"] as const,
  list: (filters: SearchFilters) =>
    [...characterKeys.lists(), filters] as const,
  details: () => [...characterKeys.all, "detail"] as const,
  detail: (id: number) => [...characterKeys.details(), id] as const,
  search: (query: string) => [...characterKeys.all, "search", query] as const,
};
```

### Episode Query Keys

```typescript
export const episodeKeys = {
  all: ["episodes"] as const,
  lists: () => [...episodeKeys.all, "list"] as const,
  list: (filters: EpisodeFilters) => [...episodeKeys.lists(), filters] as const,
  details: () => [...episodeKeys.all, "detail"] as const,
  detail: (id: number) => [...episodeKeys.details(), id] as const,
  byUrls: (urls: string[]) =>
    [...episodeKeys.all, "byUrls", urls.sort()] as const,
};
```

## 🚨 Error Handling

### API Errors

```typescript
try {
  const characters = await characterService.getCharacters();
} catch (error) {
  if (error instanceof Error) {
    // Handle specific error types
    console.error("API Error:", error.message);
  }
}
```

### Component Error Boundaries

```typescript
<ErrorBoundary
  fallback={<ErrorFallback />}
  onError={(error, errorInfo) => {
    console.error("Component Error:", error, errorInfo);
  }}>
  <MyComponent />
</ErrorBoundary>
```

## 📱 Responsive Design

### Breakpoints

```typescript
// Tailwind CSS breakpoints
sm: '640px'   // Small devices
md: '768px'   // Medium devices
lg: '1024px'  // Large devices
xl: '1280px'  // Extra large devices
2xl: '1536px' // 2X Extra large devices
```

### Usage

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {/* Responsive grid */}
</div>
```

## 🔄 State Management Patterns

### Server State (React Query)

```typescript
// Automatic caching and background updates
const { data, isLoading } = useCharacters();

// Manual cache updates
queryClient.setQueryData(characterKeys.detail(1), newCharacter);

// Invalidate and refetch
queryClient.invalidateQueries({ queryKey: characterKeys.all });
```

### Client State (React Hooks)

```typescript
// Local component state
const [isOpen, setIsOpen] = useState(false);

// Shared state via context
const { theme, toggleTheme } = useTheme();

// Persistent state
const [favorites, setFavorites] = useLocalStorage("favorites", []);
```

## 🧪 Testing APIs

### Component Testing

```typescript
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};
```

### Hook Testing

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { useCharacters } from "../hooks/useCharacters";

test("should fetch characters", async () => {
  const { result } = renderHook(() => useCharacters());

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
});
```
