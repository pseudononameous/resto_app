/**
 * RestoApp API – Node/Express (template from node_api_kit, no DB).
 * Serves /api/v1/health and /api/v1/shopify/* (Shopify proxy).
 */

require('dotenv').config({ path: '.env' });

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const responseHandler = require('./utils/response/responseHandler');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 8000;

const corsOrigin = process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173';
const corsOptions = {
  origin: corsOrigin.split(',').map((o) => o.trim()).filter(Boolean),
};
app.use(cors(corsOptions));

app.use(responseHandler);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.json({ name: 'RestoApp API', version: '1.0', docs: '/api/v1/health' });
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`RestoApp API running on port ${PORT}`);
});

module.exports = app;
