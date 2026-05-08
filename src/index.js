import express from 'express';
import { matchesRouter } from './routes/matches';

const app = express();
const port = 8080;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello');
});

app.use('/matches', matchesRouter);

app.listen(port, ()=> {
    console.log(`Server is running at http://localhost:${port}`);
});