export interface User {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    role: {
        id: number;
        name: string;
        description: string;
    }
}

export interface AuthState {
    isAuthenticated: boolean;
    jwt: string | null;
    user: User | null;
}