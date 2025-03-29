import * as React from "react";
import {Sailboat} from "lucide-react";


const Spinner: React.FC = () => {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-black z-0">
            <Sailboat className="w-12 h-12 text-[#D4AF37] animate-boat" />
            <p className="mt-4 text-sm tracking-wide">Caricamento...</p>
        </div>
    );
}

export default Spinner;