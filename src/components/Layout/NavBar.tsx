import * as React from "react";
import {Link, useNavigate} from "react-router-dom";

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
        <nav className="bg-[#0A1F44] text-white px-6 py-4 flex justify-between items-center shadow-md">
            <h1 className="text-2xl font-bold font-serif cursor-pointer" onClick={() => navigate("/")}>
                Acqua<span className="text-[#D4AF37]">Lux</span>
            </h1>
            <div className="space-x-4">
                {items.map(item => <Link to={item.link} className="hover:text-[#D4AF37] transition">{item.name}</Link>)}
            </div>
        </nav>

    );
}

export default NavBar;