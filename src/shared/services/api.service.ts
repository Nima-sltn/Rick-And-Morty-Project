import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { ApiResponse, ApiError } from "../types/api.types";

class ApiService {
  private client: AxiosInstance;
  private readonly baseURL = "https://rickandmortyapi.com/api";

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<ApiError>) => {
        const errorMessage = this.handleError(error);
        return Promise.reject(new Error(errorMessage));
      }
    );
  }

  private handleError(error: AxiosError<ApiError>): string {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error || error.message;

      switch (status) {
        case 404:
          return "Resource not found";
        case 500:
          return "Server error occurred";
        case 429:
          return "Too many requests. Please try again later";
        default:
          return message || "An unexpected error occurred";
      }
    } else if (error.request) {
      return "Network error. Please check your connection";
    } else {
      return error.message || "Request failed";
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<T>(endpoint, { params });
    return response.data;
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(endpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.client.delete<T>(endpoint);
    return response.data;
  }

  async getBatch<T>(urls: string[]): Promise<T[]> {
    const promises = urls.map((url) => this.client.get<T>(url));
    const responses = await Promise.all(promises);
    return responses.map((response) => response.data);
  }
}

export const apiService = new ApiService();
export default ApiService;
