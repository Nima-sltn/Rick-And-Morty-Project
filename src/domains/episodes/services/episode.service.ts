import { apiService } from "../../../shared/services/api.service";

import {
  Episode,
  ApiResponse,
  EpisodeFilters,
} from "../../../shared/types/api.types";

/**
 * Service class for interacting with the Rick and Morty API episode endpoints.
 * Handles fetching, searching, and filtering episodes by season.
 */
export class EpisodeService {
  private readonly endpoint = "/episode";

  async getEpisodes(
    filters: EpisodeFilters = {},
  ): Promise<ApiResponse<Episode>> {
    const params = new URLSearchParams();

    if (filters.name) params.append("name", filters.name);
    if (filters.episode) params.append("episode", filters.episode);
    if (filters.page) params.append("page", filters.page.toString());

    return apiService.get<ApiResponse<Episode>>(
      `${this.endpoint}?${params.toString()}`,
    );
  }

  async getEpisode(id: number): Promise<Episode> {
    return apiService.get<Episode>(`${this.endpoint}/${id}`);
  }

  async getEpisodesByIds(ids: number[]): Promise<Episode[]> {
    if (ids.length === 0) return [];

    const idsString = ids.join(",");

    const result = await apiService.get<Episode | Episode[]>(
      `${this.endpoint}/${idsString}`,
    );

    return Array.isArray(result) ? result : [result];
  }

  extractEpisodeIds(urls: string[]): number[] {
    const regex = /\/episode\/(\d+)$/;

    return urls
      .map((url) => {
        const match = regex.exec(url);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((id): id is number => id !== null);
  }

  async getEpisodesByUrls(urls: string[]): Promise<Episode[]> {
    const ids = this.extractEpisodeIds(urls);

    return this.getEpisodesByIds(ids);
  }

  async searchEpisodes(
    query: string,
    page: number = 1,
  ): Promise<ApiResponse<Episode>> {
    return this.getEpisodes({ name: query, page });
  }

  async getEpisodesBySeason(season: number): Promise<Episode[]> {
    const seasonCode = `S${season.toString().padStart(2, "0")}`;

    const response = await this.getEpisodes({ episode: seasonCode });

    return response.results;
  }

  /**
   * Fetches all episodes and groups them by season with metadata.
   * @returns Array of season summaries with episode counts
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
        const seasonRegex = /S(\d+)E\d+/;
        const seasonMatch = seasonRegex.exec(episode.episode);

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
          episodes: episodes.toSorted((a, b) =>
            a.episode.localeCompare(b.episode),
          ),
        }))
        .toSorted((a, b) => a.season - b.season);
    } catch (error) {
      console.error("Error fetching seasons summary:", error);

      return [];
    }
  }
}

export const episodeService = new EpisodeService();

export default EpisodeService;
