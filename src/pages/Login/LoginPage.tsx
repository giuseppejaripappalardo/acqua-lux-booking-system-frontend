import * as React from "react";
import {Form,} from "react-router-dom";

function LoginPage(){


    return (
        <div
            className="relative h-screen w-screen flex justify-center items-center bg-[url(./../../assets/images/yacht-deck.jpg)] bg-center bg-no-repeat bg-cover bg-linear-to-r from-black/60 to-black/60">
            <div className="absolute inset-0 bg-black/35 z-0" />
            <div className="bg-black/50 p-10 rounded-lg shadow-2xl 2xl:w-[380px] sm:w-[350px] z-20">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-white mb-1">AcquaLux</h1>
                    <p className="text-gray-200 font-light">Accedi al tuo account</p>
                </div>

                <Form action={"/login"} method={"post"} className="space-y-5">
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
                            className="w-full px-4 py-2 border rounded-md bg-white/90 border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                            placeholder="La tua password"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className={"w-full py-3 px-4 bg-[#D4AF37] hover:bg-yellow-600 text-white rounded-md font-medium transition duration-300"}
                        >
                            Accedi
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
}


export default LoginPage;