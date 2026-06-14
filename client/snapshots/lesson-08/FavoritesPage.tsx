import type { Recipe } from "../types";
import RecipeList from "../components/RecipeList/RecipeList";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  recipes: Recipe[];
  onToggleLike: (id: string) => void;
};

function FavoritesPage({ recipes, onToggleLike }: Props) {
  const { currentUser } = useAuth();
  const likedRecipes = currentUser
    ? recipes.filter((r) => currentUser.likes.includes(r.id))
    : [];

  return (
    <div className="app__container">
      <h1 className="app__heading">Favorites</h1>
      {likedRecipes.length === 0 ? (
        <p>No liked recipes yet</p>
      ) : (
        <RecipeList recipes={likedRecipes} onToggleLike={onToggleLike} />
      )}
    </div>
  );
}

export default FavoritesPage;
