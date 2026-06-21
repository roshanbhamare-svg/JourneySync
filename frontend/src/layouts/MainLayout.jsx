import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

function MainLayout() {

    return (

        <div className="main-layout">

            <Navbar />

            <main className="app-container" style={{ paddingBottom: "100px" }}>
                <Outlet />
            </main>

        </div>

    );

}

export default MainLayout;