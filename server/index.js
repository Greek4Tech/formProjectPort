const express = require('express');
const app = express();
const axios = require('axios')
const cors = require('cors')
const port = 4000;

// database dependencies
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

app.use(cors())
app.use(express.json());


app.get('/', (req, res) => {
  res.json('Hello World!');
});

app.post('/charge', (req, res) => {
  // Create a new URLSearchParams object to store the form data
  const body = new URLSearchParams();
  body.append('payment_method_types[]', 'card');

  // Add each line item to the URLSearchParams object
  req.body.forEach((item, index) => {
    body.append(`line_items[${index}][price_data][currency]`, 'usd');
    body.append(`line_items[${index}][price_data][product_data][name]`, item.description);
    body.append(`line_items[${index}][price_data][unit_amount]`, item.price);
    body.append(`line_items[${index}][quantity]`, item.quantity);
  });

  // Add other parameters to the URLSearchParams object
  body.append('mode', 'payment');
  body.append('success_url', 'https://example.com/success');
  body.append('cancel_url', 'https://example.com/cancel');

  // Make a POST request to the Stripe API using Axios
  axios.post("https://api.stripe.com/v1/checkout/sessions", body.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Bearer sk_test_4eC39HqLyjWDarjtT1zdp7dc" // test Stripe API key
    }
  })
  .then(response => {
    console.log(response.data)
    res.json(response.data)
  })
  .catch(error => console.error(error));
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
