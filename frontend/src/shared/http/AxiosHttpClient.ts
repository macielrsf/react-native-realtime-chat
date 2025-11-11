// frontend/src/shared/http/AxiosHttpClient.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { HttpClient } from './HttpClient';
import { env } from '../config/env';

export class AxiosHttpClient implements HttpClient {
  private axiosInstance: AxiosInstance;
  private onUnauthorized?: () => void;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: env.apiUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setAuthToken(token: string | null): void {
    if (token) {
      this.axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete this.axiosInstance.defaults.headers.common.Authorization;
    }
  }

  setUnauthorizedHandler(handler: () => void): void {
    this.onUnauthorized = handler;
  }

  private setupInterceptors(): void {
    // Response interceptor para capturar erros
    this.axiosInstance.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        // Erro 401 - não autorizado
        if (error.response?.status === 401) {
          console.warn(
            'Token expirado ou inválido - redirecionando para login',
          );
          this.onUnauthorized?.();
        }

        // Network Error - problemas de conexão
        if (error.message === 'Network Error' || !error.response) {
          console.error('Network Error - possíveis causas:');
          console.error('1. Backend não está rodando');
          console.error('2. URL incorreta:', error.config?.url);
          console.error('3. Problema de CORS');
          console.error('4. Sem conexão com a internet');
        }

        return Promise.reject(error);
      },
    );
  }

  async get<T>(url: string, config?: any): Promise<T> {
    try {
      const response = await this.axiosInstance.get(url, config);
      return response.data.data || response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await this.axiosInstance.post(url, data, config);
      return response.data.data || response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await this.axiosInstance.put(url, data, config);
      return response.data.data || response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    try {
      const response = await this.axiosInstance.delete(url, config);
      return response.data.data || response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  }
}
