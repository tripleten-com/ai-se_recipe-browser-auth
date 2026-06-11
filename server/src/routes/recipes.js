const express = require('express');
const verifyToken = require('../middleware/auth');
const recipes = require('../data/recipes');

const router = express.Router();

router.use(verifyToken);

router.get('/', (req, res) => {
  res.json({ data: recipes });
});

router.get('/:id', (req, res) => {
  const recipe = recipes.find((r) => r.id === req.params.id);
  if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
  }
  res.json({ data: recipe });
});

router.put('/:id/likes', (req, res) => {
  const recipe = recipes.find((r) => r.id === req.params.id);
  if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
  }

  const { userId } = req.user;
  if (recipe.likes.includes(userId)) {
    recipe.likes = recipe.likes.filter((id) => id !== userId);
  } else {
    recipe.likes.push(userId);
  }

  res.json({ data: recipe });
});

module.exports = router;