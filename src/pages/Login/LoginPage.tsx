import * as React from "react";
import {useEffect} from "react";
import {LoginRequest} from "../../models/request/AuthRequest.ts";
import useAuth from "../../hooks/useAuth.ts";
import {useNavigate} from "react-router-dom";
import {footerText} from "../../utils/MessagesEnum.ts";

const LoginPage: React.FC = () => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const {isAuthenticated, login, isLoading, submitDisabled, errorMessage, setSubmitDisabled} = useAuth();
    const navigate = useNavigate();


    /**
     * Questo metodo viene chiamato al submit del form di login
     * Si occupa di chiamare il servizio per effetuare la login
     * Oltre che a gestires diversi stati interni.
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const loginRequest: LoginRequest = {
            username,
            password
        }
        login(loginRequest)
    }

    useEffect(() => {
        if (username.trim() == '' || password.trim() == '') {
            setSubmitDisabled(true);
        } else {
            setSubmitDisabled(false);
        }
    }, [username, password, setSubmitDisabled, submitDisabled]);

    /**
     *  Ho inserito questo use effect per controllare se l'utente
     *  è già autenticato. Se lo è allora non deve atterrare qui e dobbiamo
     *  rimandarlo in homepage
     */
    useEffect(() => {

        console.log(
            "isAuthenticated: ",
            isAuthenticated)

        if (isAuthenticated) {
            navigate("/")
        }
    }, [isAuthenticated, navigate]);

    return (
        <div
            className="relative h-screen w-screen bg-[url(./../../assets/images/yacht-deck.jpg)] bg-center bg-no-repeat bg-cover bg-linear-to-r from-black/60 to-black/60">
            <div className="absolute inset-0 bg-black/35 z-0"/>

            <div className={"flex flex-col z-20 items-center justify-center h-full"}>
                <div className="mt-auto bg-black/50 p-10 rounded-lg shadow-2xl 2xl:w-[380px] sm:w-[350px] z-20">
                    <div className="text-center mb-6">
                        <h1 className="antialiased text-4xl font-bold text-white mb-1 font-serif">Acqua<span
                            className={'text-[#D4AF37]'}>Lux</span></h1>
                        <p className="text-gray-200 font-light">Accedi al tuo account</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-1">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="username"
                                autoComplete="username"
                                required
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md bg-white/90 border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                                placeholder="Username"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md bg-white/90 border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                                placeholder="La tua password"
                            />
                        </div>

                        {
                            errorMessage ?
                                <div
                                    className={"text-red-500 text-left text-sm h-4 bg-black/50 flex justify-center items-center p-5 rounded-md z-20"}>
                                    {errorMessage}
                                </div>
                                :
                                <div className={"text-red-500 text-sm h-4 rounded-md p-5"}>
                                </div>
                        }


                        <div>
                            <button
                                type="submit"
                                className={`w-full py-3 px-4 bg-[#D4AF37] hover:bg-yellow-600 text-white rounded-md font-medium transition duration-300 disabled:bg-gray-400/60 disabled:hover:bg-gray-400/60 disabled:cursor-not-allowed`}
                                disabled={submitDisabled}
                            >
                                {
                                    isLoading ? "Accesso in corso..." : "Accedi"
                                }
                            </button>
                        </div>
                    </form>
                </div>

                <footer className={"mt-auto align-bottom p-5 bg-black/60 min-w-full text-center text-white z-20"}>
                    {footerText}
                </footer>
            </div>
        </div>
    );
}


export default LoginPage;