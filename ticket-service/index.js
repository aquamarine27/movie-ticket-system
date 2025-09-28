const express = require('express');
const fs = require('fs').promises;
const axios = require('axios');
const app = express();
const port = 5002;

app.use(express.json());
const ticketsFile = 'tickets.json';

// Инициализация tickets.json
(async () => {
  try {
    await fs.access(ticketsFile);
  } catch {
    await fs.writeFile(ticketsFile, JSON.stringify([]));
  }
})();

// GET /tickets 
app.get('/tickets', async (req, res) => {
  try {
    const data = await fs.readFile(ticketsFile);
    const tickets = JSON.parse(data);
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Не удалось прочитать билеты' });
  }
});

// GET /tickets/:id - 
app.get('/tickets/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Неверный ID' });
    const data = await fs.readFile(ticketsFile);
    const tickets = JSON.parse(data);
    const ticket = tickets.find(t => t.id === id);
    if (!ticket) return res.status(404).json({ error: 'Билет не найден' });
    const movieResponse = await axios.get(`http://movie-service:5001/movies/${ticket.movieId}`);
    if (movieResponse.status !== 200) {
      return res.status(500).json({ error: 'Не удалось получить данные о фильме' });
    }
    res.json({ ticket, movie: movieResponse.data });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /tickets 
app.post('/tickets', async (req, res) => {
  try {
    const { movieId, seat } = req.body;
    if (!movieId || !seat) return res.status(400).json({ error: 'Укажите movieId и seat' });
    const data = await fs.readFile(ticketsFile);
    const tickets = JSON.parse(data);
    const newTicket = { id: tickets.length + 1, movieId, seat };
    tickets.push(newTicket);
    await fs.writeFile(ticketsFile, JSON.stringify(tickets, null, 2));
    res.status(201).json(newTicket);
  } catch (err) {
    res.status(500).json({ error: 'Не удалось добавить билет' });
  }
});

app.listen(port, () => console.log(`Ticket Service запущен на порту ${port}`));