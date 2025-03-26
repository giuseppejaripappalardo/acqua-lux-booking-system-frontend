import {Outlet} from "react-router-dom";
import * as React from "react";


const LoginLayout: React.FC = () => {
    return (
        <div>
            <nav>
                test nav
            </nav>
            <Outlet/>
        </div>
    )
}

export default LoginLayout;