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

        <div
            style={{
                textAlign: "center",
                marginTop: "100px"
            }}
        >

            <h1>
                JourneySync
            </h1>

            <p>
                Smart Trip Planning Platform
            </p>

            {
                !token ? (

                    <>

                        <button
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Login
                        </button>

                        {" "}

                        <button
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
                            onClick={() =>
                                navigate("/dashboard")
                            }
                        >
                            Dashboard
                        </button>

                        {" "}

                        <button
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </>

                )
            }

        </div>

    );

}

export default Home;