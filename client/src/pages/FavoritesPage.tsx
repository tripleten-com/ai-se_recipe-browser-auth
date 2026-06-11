import type { Recipe } from '../types';
import RecipeList from '../components/RecipeList/RecipeList';
import { useFavorites } from '../contexts/FavoritesContext';

type Props = {
  recipes: Recipe[];
};

function FavoritesPage({ recipes }: Props) {
  const { favorites } = useFavorites();
  const favorited = recipes.filter((r) => favorites.has(r.id));

  return (
    <div className="app__container">
      <h1 className="app__heading">Favorites</h1>
      {favorited.length === 0 ? (
        <p>No liked recipes yet</p>
      ) : (
        <RecipeList recipes={favorited} />
      )}
    </div>
  );
}

export default FavoritesPage;
