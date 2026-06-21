import { useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

    const token =
    localStorage.getItem("token");

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("currentTripId");

        navigate("/");

    };

    return (

        <div className="hero-container">

            <h1 className="hero-title">
                JourneySync
            </h1>

            <p className="hero-subtitle">
                The smart trip planning platform to plan, track, and budget your dream travel adventures seamlessly.
            </p>

            <div className="hero-actions">

                {
                    !token ? (

                        <>

                            <button
                                className="btn-primary"
                                onClick={() =>
                                    navigate("/login")
                                }
                            >
                                Login
                            </button>

                            <button
                                className="btn-secondary"
                                onClick={() =>
                                    navigate("/register")
                                }
                            >
                                Sign Up
                            </button>

                        </>

                    ) : (

                        <>

                            <button
                                className="btn-primary"
                                onClick={() =>
                                    navigate("/dashboard")
                                }
                            >
                                Go to Dashboard
                            </button>

                            <button
                                className="btn-secondary"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </>

                    )
                }

            </div>

        </div>

    );

}

export default Home;