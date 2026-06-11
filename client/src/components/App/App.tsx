import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import type { Recipe } from '../../types';
import { getRecipes } from '../../utils/api';
import AppLayout from '../AppLayout/AppLayout';
import HomePage from '../../pages/HomePage';
import FavoritesPage from '../../pages/FavoritesPage';
import RecipePage from '../../pages/RecipePage';
import NotFoundPage from '../../pages/NotFoundPage';

import './App.css';

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getRecipes()
      .then((data) => {
        setRecipes(data);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p className="app__loading">Loading...</p>;
  }

  if (error) {
    return <p className="app__message">Sign in to view recipes.</p>;
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage recipes={recipes} />} />
        <Route
          path="/favorites"
          element={<FavoritesPage recipes={recipes} />}
        />
        <Route path="/recipes/:id" element={<RecipePage recipes={recipes} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
