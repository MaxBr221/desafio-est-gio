import express from 'express';
import cors from 'cors';
import routes from './src/routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`[SERVER] API rodando na porta ${PORT}`);
});