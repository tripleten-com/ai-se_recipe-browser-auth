const express = require('express');
const cors = require('cors');
const { PORT } = require('./config');
const authRouter = require('./routes/auth');
const recipesRouter = require('./routes/recipes');
const usersRouter = require('./routes/users');

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/recipes', recipesRouter);
app.use('/users', usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
