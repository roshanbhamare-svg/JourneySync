import { NavLink, Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const tripId = localStorage.getItem("currentTripId");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("currentTripId");
        navigate("/");
    };

    return (

        <nav className="navbar">

            <div className="navbar-container">

                <Link to="/" className="navbar-brand">
                    JourneySync <span>Planner</span>
                </Link>

                <div className="navbar-links">

                    {token && (
                        <NavLink 
                            to="/dashboard" 
                            className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
                        >
                            Dashboard
                        </NavLink>
                    )}

                    {
                        token && tripId && (
                            <>
                                <NavLink
                                    to={`/trip/${tripId}/places`}
                                    className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
                                >
                                    Places
                                </NavLink>

                                <NavLink
                                    to={`/trip/${tripId}/restaurants`}
                                    className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
                                >
                                    Restaurants
                                </NavLink>

                                <NavLink
                                    to={`/trip/${tripId}/transport`}
                                    className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
                                >
                                    Transport
                                </NavLink>

                                <NavLink
                                    to={`/trip/${tripId}/preitinerary`}
                                    className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
                                >
                                    Pre Itinerary
                                </NavLink>

                                <NavLink
                                    to={`/trip/${tripId}/finalitinerary`}
                                    className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
                                >
                                    Final Itinerary
                                </NavLink>

                                <NavLink
                                    to={`/trip/${tripId}/budget`}
                                    className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
                                >
                                    Budget
                                </NavLink>

                                <NavLink
                                    to={`/trip/${tripId}/expense`}
                                    className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
                                >
                                    Expense
                                </NavLink>

                                <NavLink
                                    to={`/trip/${tripId}/checklist`}
                                    className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
                                >
                                    Checklist
                                </NavLink>
                            </>
                        )
                    }

                    {token ? (
                        <button 
                            onClick={handleLogout} 
                            className="navbar-link" 
                            style={{ background: "none", border: "none", cursor: "pointer" }}
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <NavLink 
                                to="/login" 
                                className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
                            >
                                Login
                            </NavLink>
                            <NavLink 
                                to="/register" 
                                className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
                            >
                                Register
                            </NavLink>
                        </>
                    )}

                </div>

            </div>

        </nav>

    );

}

export default Navbar;