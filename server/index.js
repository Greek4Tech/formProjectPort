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

app.post('/charge', (req, res) => {
  

// Create a new URLSearchParams object to store the form data
    const body = new URLSearchParams();
    body.append('payment_method_types[]', 'card');

    // Add each line item to the URLSearchParams object
    data.forEach((item, index) => {
      body.append(`line_items[${index}][price_data][currency]`, 'usd');
      body.append(`line_items[${index}][price_data][product_data][name]`, item.description);
      body.append(`line_items[${index}][price_data][unit_amount]`, item.price);
      body.append(`line_items[${index}][quantity]`, item.quantity);
    });
    
    // Add other parameters to the URLSearchParams object
    body.append('mode', 'payment');
    body.append('success_url', 'https://example.com/success');
    body.append('cancel_url', 'https://example.com/cancel');

    // Make a POST request to the Stripe API using the fetch API
    fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Bearer sk_test_4eC39HqLyjWDarjtT1zdp7dc" // test Stripe API key
      },
      // Use the URLSearchParams object as the request body
      body: body
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err))
  })

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
