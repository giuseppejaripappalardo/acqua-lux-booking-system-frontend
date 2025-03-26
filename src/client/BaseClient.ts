import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";


const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
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

export const apiGet = <T, P = any>(url: string, params?: P, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, { params, ...config });
};

export const apiPost = <T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
};

export const apiDelete = <T, P = any>(url: string, config?: AxiosRequestConfig & { params?: P }): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
};