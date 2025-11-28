const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./routes');
require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ status: 'Flux API online', endpoints: ['/api/auth/login', '/api/summary', '/api/pix/send'] });
});

app.use('/api', router);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Erro interno no servidor Flux', error: err.message });
});

app.listen(PORT, () => console.log(`Flux API escutando na porta ${PORT}`));
