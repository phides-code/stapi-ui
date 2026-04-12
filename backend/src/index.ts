import express from 'express';

const app = express();
const PORT = 8000;

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from Express + TSX' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
