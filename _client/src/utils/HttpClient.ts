import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { HttpMethod } from '../enum/http-methods.enum';

// Create the Axios instance
const api: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

// Define a helper function to handle requests
export const HttpClient = async <T>(
  method: HttpMethod,
  url: string,
  data?: any,
  options?: {}
): Promise<T> => {
  const config: AxiosRequestConfig = {
    method,
    url,
    data,
    headers: options,
  };
  try {
    console.log(config);
    const response = await api.request<T>(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
