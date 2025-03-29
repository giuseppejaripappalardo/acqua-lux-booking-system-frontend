import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {authAtom} from "../store/auth.ts";


const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_DEV_ENV === 'DEV' ? '' : import.meta.env.VITE_API_URL,
    timeout: 5000,
    withCredentials: true,
});

// interceptor per fare il catch degli errori.
apiClient.interceptors.response.use(
    response => response,
    error => {
        console.error('API request failed:', error);
        return Promise.reject(error);
    }
);

export const baseUrl = "/api/v1";

export const apiGet = <T, P = never>(url: string, params?: P, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.get<T>(url, { params, ...config }).then(response => response.data);
};

export const apiPost = <T, D = never>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.post<T>(url, data, config).then(response => response.data);
};

export const apiDelete = <T, P = never>(url: string, config?: AxiosRequestConfig & { params?: P }): Promise<T> => {
    return apiClient.delete<T>(url, config).then(response => response.data);
};