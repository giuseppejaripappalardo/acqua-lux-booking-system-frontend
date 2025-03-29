import {Outlet} from "react-router-dom";
import NavBar, {NavBarItem} from "../components/Layout/NavBar.tsx";
import Footer from "../components/Layout/Footer.tsx";

const DashboardLayout = () => {
    const navBarItems: NavBarItem[] = [
        {name: "Home", link: "/"},
        {name: "Prenotazioni", link: "/my-bookings"},
    ];
    return (
        <div className={"flex flex-col min-h-screen"}>
            <NavBar items={navBarItems}/>
            <main className={"flex-1 bg-[#F8F9FA]"}>
                <Outlet/>
            </main>
            <Footer/>
        </div>
    )
}

export default DashboardLayout;