const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const cellRoutes = require('./routes/cellRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/', cellRoutes);

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
