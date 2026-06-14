import { useNavigate } from "react-router";

import type { Recipe } from "../../types";
import { categoryColors } from "../../data/recipes";
import "./RecipeCard.css";
import { useAuth } from "../../contexts/AuthContext";

type Props = {
  recipe: Recipe;
  onToggleLike: (id: string) => void;
};

function RecipeCard({ recipe, onToggleLike }: Props) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isLiked = currentUser?.likes.includes(recipe.id) ?? false;

  return (
    <article className="recipe-card">
      <button
        type="button"
        className="recipe-card__view"
        onClick={() => navigate(`/recipes/${recipe.id}`)}
        aria-label="View recipe details"
      ></button>
      <button
        type="button"
        className="recipe-card__favorite"
        onClick={(e) => {
          e.stopPropagation();
          onToggleLike(recipe.id);
        }}
        aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
      >
        {isLiked ? "♥" : "♡"}
      </button>
      <span
        style={{
          backgroundColor: categoryColors[recipe.category.toLocaleLowerCase()],
        }}
        className="recipe-card__category"
      >
        {recipe.category}
      </span>
      <h2 className="recipe-card__title">{recipe.title}</h2>
      <p className="recipe-card__description">{recipe.description}</p>
    </article>
  );
}

export default RecipeCard;
