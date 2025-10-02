import { apiService } from "../../../shared/services/api.service";
import {
  Episode,
  ApiResponse,
  EpisodeFilters,
} from "../../../shared/types/api.types";

export class EpisodeService {
  private readonly endpoint = "/episode";

  /**
   * Get paginated list of episodes with optional filters
   */
  async getEpisodes(
    filters: EpisodeFilters = {}
  ): Promise<ApiResponse<Episode>> {
    const params = new URLSearchParams();

    if (filters.name) params.append("name", filters.name);
    if (filters.episode) params.append("episode", filters.episode);
    if (filters.page) params.append("page", filters.page.toString());

    return apiService.get<ApiResponse<Episode>>(
      `${this.endpoint}?${params.toString()}`
    );
  }

  /**
   * Get a single episode by ID
   */
  async getEpisode(id: number): Promise<Episode> {
    return apiService.get<Episode>(`${this.endpoint}/${id}`);
  }

  /**
   * Get multiple episodes by IDs
   */
  async getEpisodesByIds(ids: number[]): Promise<Episode[]> {
    if (ids.length === 0) return [];

    const idsString = ids.join(",");
    const result = await apiService.get<Episode | Episode[]>(
      `${this.endpoint}/${idsString}`
    );

    return Array.isArray(result) ? result : [result];
  }

  /**
   * Extract episode IDs from URLs
   */
  extractEpisodeIds(urls: string[]): number[] {
    return urls
      .map((url) => {
        const match = url.match(/\/episode\/(\d+)$/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((id): id is number => id !== null);
  }

  /**
   * Get episodes by URLs (common pattern in Rick and Morty API)
   */
  async getEpisodesByUrls(urls: string[]): Promise<Episode[]> {
    const ids = this.extractEpisodeIds(urls);
    return this.getEpisodesByIds(ids);
  }

  /**
   * Search episodes
   */
  async searchEpisodes(
    query: string,
    page: number = 1
  ): Promise<ApiResponse<Episode>> {
    return this.getEpisodes({ name: query, page });
  }

  /**
   * Get episodes by season
   */
  async getEpisodesBySeason(season: number): Promise<Episode[]> {
    const seasonCode = `S${season.toString().padStart(2, "0")}`;
    const response = await this.getEpisodes({ episode: seasonCode });
    return response.results;
  }

  /**
   * Get all seasons with episode counts
   */
  async getSeasonsSummary(): Promise<
    { season: number; episodeCount: number; episodes: Episode[] }[]
  > {
    try {
      const firstPage = await this.getEpisodes({ page: 1 });
      const totalPages = firstPage.info.pages;

      const allEpisodes: Episode[] = [];
      for (let page = 1; page <= totalPages; page++) {
        const pageData = await this.getEpisodes({ page });
        allEpisodes.push(...pageData.results);
      }

      const seasonMap = new Map<number, Episode[]>();

      allEpisodes.forEach((episode) => {
        const seasonMatch = episode.episode.match(/S(\d+)E\d+/);
        if (seasonMatch) {
          const season = parseInt(seasonMatch[1], 10);
          if (!seasonMap.has(season)) {
            seasonMap.set(season, []);
          }
          seasonMap.get(season)!.push(episode);
        }
      });

      return Array.from(seasonMap.entries())
        .map(([season, episodes]) => ({
          season,
          episodeCount: episodes.length,
          episodes: episodes.sort((a, b) => a.episode.localeCompare(b.episode)),
        }))
        .sort((a, b) => a.season - b.season);
    } catch (error) {
      console.error("Error fetching seasons summary:", error);
      return [];
    }
  }
}

export const episodeService = new EpisodeService();
export default EpisodeService;
