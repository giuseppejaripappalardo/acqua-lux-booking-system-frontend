import * as React from "react";
import {Link, useNavigate} from "react-router-dom";
import UserMenu from "./UserMenu.tsx";
import MobileMenu from "./MobileMenu.tsx";

export interface NavBarItem {
    name: string;
    link: string;
}

interface NavBarProps {
    items: NavBarItem[]
}

const NavBar: React.FC<NavBarProps> = ({items}) => {
    const navigate = useNavigate();

    return (
        <nav className="bg-[#0A1F44] text-white px-6 py-4 flex justify-between items-center shadow-md z-20">
            <div onClick={() => navigate("/")} className="text-2xl font-serif font-bold cursor-pointer">
                Acqua<span className="text-[#D4AF37]">Lux</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
                {items.map(item => (
                    <Link to={item.link} key={item.link} className="hover:text-[#D4AF37] transition">{item.name}</Link>
                ))}
                <UserMenu/>
            </div>
            <MobileMenu items={items} />
        </nav>
    );
}

export default NavBar;