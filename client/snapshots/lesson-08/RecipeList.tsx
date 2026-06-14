import type { Recipe } from "../../types";
import RecipeCard from "../RecipeCard/RecipeCard";
import "./RecipeList.css";

type Props = {
  recipes: Recipe[];
  onToggleLike: (id: string) => void;
};

function RecipeList({ recipes, onToggleLike }: Props) {
  return (
    <ul className="recipe-list">
      {recipes.map((recipe) => (
        <li key={recipe.id} className="recipe-list__item">
          <RecipeCard recipe={recipe} onToggleLike={onToggleLike} />
        </li>
      ))}
    </ul>
  );
}

export default RecipeList;
