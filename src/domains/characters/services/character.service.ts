import { apiService } from "../../../shared/services/api.service";
import {
  Character,
  ApiResponse,
  SearchFilters,
} from "../../../shared/types/api.types";

export class CharacterService {
  private readonly endpoint = "/character";

  /**
   * Get paginated list of characters with optional filters
   */
  async getCharacters(
    filters: SearchFilters = {}
  ): Promise<ApiResponse<Character>> {
    const params = new URLSearchParams();

    if (filters.name) params.append("name", filters.name);
    if (filters.status) params.append("status", filters.status);
    if (filters.species) params.append("species", filters.species);
    if (filters.gender) params.append("gender", filters.gender);
    if (filters.page) params.append("page", filters.page.toString());

    return apiService.get<ApiResponse<Character>>(
      `${this.endpoint}?${params.toString()}`
    );
  }

  /**
   * Get a single character by ID
   */
  async getCharacter(id: number): Promise<Character> {
    return apiService.get<Character>(`${this.endpoint}/${id}`);
  }

  /**
   * Get multiple characters by IDs
   */
  async getCharactersByIds(ids: number[]): Promise<Character[]> {
    if (ids.length === 0) return [];

    const idsString = ids.join(",");
    const result = await apiService.get<Character | Character[]>(
      `${this.endpoint}/${idsString}`
    );

    return Array.isArray(result) ? result : [result];
  }

  /**
   * Extract character IDs from episode URLs
   */
  extractCharacterIds(urls: string[]): number[] {
    return urls
      .map((url) => {
        const match = url.match(/\/character\/(\d+)$/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((id): id is number => id !== null);
  }

  /**
   * Search characters with debounced query
   */
  async searchCharacters(
    query: string,
    page: number = 1
  ): Promise<ApiResponse<Character>> {
    return this.getCharacters({ name: query, page });
  }

  /**
   * Get random characters (using random page)
   */
  async getRandomCharacters(count: number = 5): Promise<Character[]> {
    try {
      const firstPage = await this.getCharacters({ page: 1 });
      const totalPages = firstPage.info.pages;

      const randomPage = Math.floor(Math.random() * totalPages) + 1;
      const randomPageData = await this.getCharacters({ page: randomPage });

      const shuffled = randomPageData.results.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    } catch (error) {
      console.error("Error fetching random characters:", error);
      return [];
    }
  }
}

export const characterService = new CharacterService();
export default CharacterService;
