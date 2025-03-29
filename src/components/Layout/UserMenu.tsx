import * as React from "react";
import {useEffect, useRef, useState} from "react";
import useAuth from "../../hooks/useAuth.ts";

const UserMenu: React.FC = () => {
    const [open, setOpen] = useState(false);
    const {logout, getLoggedUser} = useAuth();
    const user = getLoggedUser();
    const [userInitials, setUserInitials] = useState("");
    const menuRef = useRef<HTMLDivElement>(null)

    const handleLogout = () => {
        logout();
    }

    useEffect(() => {
        // qui stiamo gestendo le iniziali dell'utente da mostrare nell'avatar.
        if (user) {
            // prendo il primo carattere
            const firstName = user?.firstname.charAt(0);
            // anche qui prendiamo il primo carattere.
            const lastName = user?.lastname.charAt(0);

            // A questo punto assegniamo il valore delle due iniziali :)
            setUserInitials(`${firstName}${lastName}`);
        }
    }, [user]);

    useEffect(() => {
        const handleCLickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener("mousedown", (e: MouseEvent) => {
                handleCLickOutside(e);
            });
        }

        return () => {
            document.removeEventListener("mousedown", handleCLickOutside);
        }
    }, [open]);


    return (
        <div className="relative" ref={menuRef}>
            <div
                className="w-10 h-10 bg-[#D4AF37] text-white font-bold flex items-center justify-center rounded-full cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                {userInitials !== "" && userInitials}
            </div>
            {open && (
                <div className="absolute right-0 mt-2 bg-white text-sm rounded shadow-lg w-48 z-50">
                    <button
                        onClick={() => handleLogout()}
                        className="w-full text-left px-4 py-2 font-semibold text-red-600 cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;