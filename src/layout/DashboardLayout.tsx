import {Outlet} from "react-router-dom";
import NavBar, {NavBarItem} from "../components/Layout/NavBar.tsx";
import Footer from "../components/Layout/Footer.tsx";

/**
 *  Questo componente è il layout di base della dashboard
 *  Contiene la navbar, il footer e ovviamente l'Outlet per fare il
 *  render dei componenti children.
 */
const DashboardLayout = () => {
    const navBarItems: NavBarItem[] = [
        {name: "Home", link: "/"},
        {name: "Prenotazioni", link: "/my-bookings"},
    ];

    return (
        <div className={"flex flex-col min-h-screen bg-[#F8F9FA]"}>
            <NavBar items={navBarItems}/>
            <main className={"flex-grow container mx-auto px-6 py-4"}>
                <Outlet/>
            </main>
            <Footer/>
        </div>
    )
}

export default DashboardLayout;