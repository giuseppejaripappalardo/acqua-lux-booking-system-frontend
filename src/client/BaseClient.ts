import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {authAtom} from "../store/auth.ts";
import {AuthState} from "../models/object/AuthState.ts";
import {getDefaultStore} from "jotai";
import AuthService from "../services/Auth/AuthService.ts";

const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_DEV_ENV === 'DEV' ? '' : import.meta.env.VITE_API_BASE_URL,
    timeout: 5000,
    withCredentials: true,
});

/**
 interceptor che utilizziamo per iniettare il token jwt se c'è.
 Se non c'è nello state jotai allora proviamo a chiamare l'endpoint
 che legge dal cookie il jwt e lo ritorna.
 lo scopo ultimo è salvare il jwt in una variabile volatile per garantire
 il massimo della sicurezza e prevenire eventuali attacchi xss
 **/
apiClient.interceptors.request.use(
    async (config) => {

        /**
         *  Questo controllo serve a prevenire l'injection del token jwt nel caso in cui si sta tentando di fare
         *  la login.
         */
        if (config.url === AuthService.loginUrl || config.url === AuthService.getTokenUrl) {
            return config;
        }

        /**
         * Instanziamo lo state manager Jotai
         */
        const jotaiStore = getDefaultStore()
        const auth = jotaiStore.get(authAtom) as AuthState;
        const jwt = auth.jwt;


        if(jwt) {
            /**
             *  Qui ci finiamo solo se nello state il token è già settato.
             *  Questo si verifica solo nei casi in cui l'utente ha fatto la login
             *  E non ha ricaricato la pagina.
             *  Il fatto di ricaricare la pagina implica che lo stato venga distrutto e non è più accessibile.
             *  Ho deciso per scelta di non persistere il token in localStorage per prevenire attacchi XSS.
             */
            config.headers.Authorization = `Bearer ${jwt}`;
        }
        return config;
    },
)


// interceptor per fare il catch degli errori.
apiClient.interceptors.response.use(
    response => response,
    error => {

        if(error.response?.status === 401) {
            // Se siamo qui vuol dire che il token non è più valido o è scaduto.
            const jotaiStore = getDefaultStore()
            jotaiStore.set(authAtom, {
                isAuthenticated: false,
                user: null,
                jwt: null
            });
        }

        console.error('API request failed:', error);
        return Promise.reject(error);
    }
);

export const baseUrl = "/api/v1";

export const apiGet = async<T, P = never>(url: string, params?: P, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.get<T>(url, {params, ...config}).then(response => response.data);
};

export const apiPost = async <T, D = never>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.post<T>(url, data, config).then(response => response.data);
};

export const apiDelete = async <T, P = never>(url: string, config?: AxiosRequestConfig & { params?: P }): Promise<T> => {
    return apiClient.delete<T>(url, config).then(response => response.data);
};