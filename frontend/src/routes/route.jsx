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
import Restaurants from "../pages/Restaurants";
import Transport from "../pages/Transport";
import PreItinerary from "../pages/PreItinerary";
import FinalItinerary from "../pages/FinalItinerary";
import BudgetTracker from "../pages/BudgetTracker";
import ExpenseTracker from "../pages/ExpenseTracker";
import Checklist from "../pages/Checklist";


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

     <Route
    path="/trip/:tripId/restaurants"
    element={<Restaurants />}
    />

<Route
    path="/trip/:tripId/transport"
    element={<Transport />}
/>

<Route
    path="/trip/:tripId/preitinerary"
    element={<PreItinerary />}
/>

<Route
path="/trip/:tripId/final-itinerary"
element={<FinalItinerary />}
/>


<Route
    path="/trip/:tripId/budget"
    element={<BudgetTracker />}
/>

<Route
path="/trip/:tripId/expense"
element={<ExpenseTracker />}
/>

<Route
path="/trip/:tripId/checklist"
element={<Checklist />}
/>

    </Routes>

  );

}

export default AppRoutes;