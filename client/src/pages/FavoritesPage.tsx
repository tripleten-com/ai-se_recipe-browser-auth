import type { Recipe } from '../types';
import RecipeList from '../components/RecipeList/RecipeList';

type Props = {
  recipes: Recipe[];
};

function FavoritesPage({ recipes }: Props) {
  return (
    <div className="app__container">
      <h1 className="app__heading">Favorites</h1>
      {recipes.length === 0 ? (
        <p>No liked recipes yet</p>
      ) : (
        <RecipeList recipes={recipes} />
      )}
    </div>
  );
}

export default FavoritesPage;
