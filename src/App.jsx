import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "/src/pages/Login";
import PricingsList from "/src/pages/PricingsList";
import NewClient from "/src/pages/NewClient";
import NewPricing from "/src/pages/NewPrecing";
import PricingReview from "/src/pages/PricingReview";
import ProtectedRoute from "/src/components/protectdeRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/pricings"
          element={
            <ProtectedRoute>
              <PricingsList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients/new"
          element={
            <ProtectedRoute>
              <NewClient />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pricings/new"
          element={
            <ProtectedRoute>
              <NewPricing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pricings/review/:id"
          element={
            <ProtectedRoute>
              <PricingReview />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
