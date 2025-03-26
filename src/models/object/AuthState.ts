export interface User {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    role: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}