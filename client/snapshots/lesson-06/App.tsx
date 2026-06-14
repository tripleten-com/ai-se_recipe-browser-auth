import { useState, useEffect } from "react";
import { Routes, Route, NavLink } from "react-router-dom";

import type { Recipe } from "../../types";
import { getRecipes } from "../../utils/api";
import AppLayout from "../AppLayout/AppLayout";
import HomePage from "../../pages/HomePage";
import FavoritesPage from "../../pages/FavoritesPage";
import RecipePage from "../../pages/RecipePage";
import NotFoundPage from "../../pages/NotFoundPage";
import "./App.css";
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import { useAuth } from "../../contexts/AuthContext";
import { ProtectedRoute, PublicRoute } from "../ProtectedRoute/ProtectedRoute";

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    setIsLoading(true);
    setError("");
    getRecipes()
      .then((data) => {
        setRecipes(data);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [isAuthenticated]);

  /** Renders loading/error in the home route rather than returning early, keeping other routes reachable. */
  function homeContent() {
    if (isLoading) return <p className="app__loading">Loading...</p>;
    if (!isAuthenticated) {
      return (
        <p className="app__message">
          <NavLink to="/login">Sign in</NavLink> to view recipes.
        </p>
      );
    }
    if (error) {
      return <p className="app__message">Failed to load recipes.</p>;
    }
    return <HomePage recipes={recipes} />;
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={homeContent()} />
          <Route
            path="/favorites"
            element={<FavoritesPage recipes={recipes} />}
          />
          <Route
            path="/recipes/:id"
            element={<RecipePage recipes={recipes} />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
