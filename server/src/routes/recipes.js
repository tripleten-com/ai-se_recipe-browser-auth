const express = require('express');
const verifyToken = require('../middleware/auth');
const recipes = require('../data/recipes');
const users = require('../data/users');

const router = express.Router();

router.use(verifyToken);

router.get('/', (req, res) => {
  res.json({ data: recipes });
});

router.get('/:id', (req, res) => {
  const recipe = recipes.find((r) => r.id === req.params.id);
  if (!recipe) {
    console.error(`GET /recipes/${req.params.id} 404: recipe not found`);
    return res.status(404).json({ message: 'Recipe not found' });
  }
  res.json({ data: recipe });
});

router.put('/:id/likes', (req, res) => {
  const recipe = recipes.find((r) => r.id === req.params.id);
  if (!recipe) {
    console.error(`PUT /recipes/${req.params.id}/likes 404: recipe not found`);
    return res.status(404).json({ message: 'Recipe not found' });
  }

  const { userId } = req.user;

  if (recipe.likes.includes(userId)) {
    recipe.likes = recipe.likes.filter((id) => id !== userId);
  } else {
    recipe.likes.push(userId);
  }

  const user = users.find((u) => u.userId === userId);
  if (user) {
    if (user.likes.includes(recipe.id)) {
      user.likes = user.likes.filter((id) => id !== recipe.id);
    } else {
      user.likes.push(recipe.id);
    }
  }

  res.json({ data: recipe });
});

module.exports = router;
