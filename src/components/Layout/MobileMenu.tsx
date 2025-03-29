import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {Menu, X} from "lucide-react";
import {NavBarItem} from "./NavBar.tsx";
import * as React from "react";
import useAuth from "../../hooks/useAuth.ts"; // lucide-react icons

interface MobileNavBarProps {
    items: NavBarItem[]
}

const MobileMenu: React.FC<MobileNavBarProps> = ({items}) => {
    const [open, setOpen] = useState(false);
    const {logout} = useAuth();
    const mobileMenuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener("mousedown", (e: MouseEvent) => {
                handleClickOutside(e);
            });
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }

    }, [open]);

    const handleLogout = () => {
        logout();
    }

    return (
        <div className="md:hidden relative" ref={mobileMenuRef}>
            <button className={"cursor-pointer"} onClick={() => setOpen(!open)}>
                {open ? <X className="text-white"/> : <Menu className="text-white"/>}
            </button>
            {open && (
                <div className="absolute right-0 mt-2 bg-white rounded shadow-lg z-50 min-w-[200px]">
                    {items.map((item) => (
                        <Link
                            key={item.name}
                            to={item.link}
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                            onClick={() => setOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <button
                        onClick={() => handleLogout()}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default MobileMenu;
