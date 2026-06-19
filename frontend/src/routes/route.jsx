import {
  Routes,
  Route
}
from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import TripWorkspace from "../pages/TripWorkspace";
import Places from "../pages/Places";

function AppRoutes() {

  return (

    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/trip/:tripId"
        element={<TripWorkspace />}
    />

      <Route
    path="/trip/:tripId/places"
    element={<Places />}
     />

    </Routes>

  );

}

export default AppRoutes;