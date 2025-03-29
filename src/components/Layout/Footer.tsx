import * as React from "react";
import {footerText} from "../../utils/MessagesEnum.ts";

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#0A1F44] text-white text-center px-6 py-4 text-sm">
            {footerText}
        </footer>
    )
}

export default Footer;