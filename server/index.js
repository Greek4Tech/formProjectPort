const express = require('express');
const app = express();
const cors = require('cors')
const port = 4000;

app.use(cors())

app.get('/', (req, res) => {
  res.json('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
