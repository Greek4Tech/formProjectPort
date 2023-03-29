const express = require('express');
const app = express();
const cors = require('cors')
const port = 4000;

app.use(cors())

const data = [
  { description: "apples", quantity: 1, price: 100 },
  { description: "mayo", quantity: 1, price: 250 },
  { description: "oranges", quantity: 1, price: 400 },
]

app.get('/', (req, res) => {
  res.json('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
