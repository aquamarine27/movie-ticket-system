const express = require('express');
const fs = require('fs').promises;
const app = express();
const port = 5001;

app.use(express.json());
const moviesFile = 'movies.json';

// Инициализация movies.json
(async () => {
  try {
    await fs.access(moviesFile);
  } catch {
    await fs.writeFile(moviesFile, JSON.stringify([]));
  }
})();

// GET /movies 
app.get('/movies', async (req, res) => {
  try {
    const data = await fs.readFile(moviesFile);
    const movies = JSON.parse(data);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: 'Не удалось прочитать фильмы' });
  }
});

// GET /movies/:id 
app.get('/movies/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Неверный ID' });
    const data = await fs.readFile(moviesFile);
    const movies = JSON.parse(data);
    const movie = movies.find(m => m.id === id);
    if (!movie) return res.status(404).json({ error: 'Фильм не найден' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: 'Не удалось прочитать фильмы' });
  }
});

// POST /movies 
app.post('/movies', async (req, res) => {
  try {
    const { title, director } = req.body;
    if (!title || !director) return res.status(400).json({ error: 'Укажите title и director' });
    const data = await fs.readFile(moviesFile);
    const movies = JSON.parse(data);
    const newMovie = { id: movies.length + 1, title, director };
    movies.push(newMovie);
    await fs.writeFile(moviesFile, JSON.stringify(movies, null, 2));
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(500).json({ error: 'Не удалось добавить фильм' });
  }
});

app.listen(port, () => console.log(`Movie Service запущен на порту ${port}`));