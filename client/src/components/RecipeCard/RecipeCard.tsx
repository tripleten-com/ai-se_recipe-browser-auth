import { useNavigate } from 'react-router';

import type { Recipe } from '../../types';
import { categoryColors } from '../../data/recipes';
import { useFavorites } from '../../contexts/FavoritesContext';
import './RecipeCard.css';

type Props = {
  recipe: Recipe;
};

function RecipeCard({ recipe }: Props) {
  const navigate = useNavigate();
  const { favorites, onToggleFavorite } = useFavorites();
  const isFavorited = favorites.has(recipe.id);

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
          onToggleFavorite(recipe.id);
        }}
        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorited ? '♥' : '♡'}
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
