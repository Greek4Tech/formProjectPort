const express = require('express');
const app = express();
const axios = require('axios')
const cors = require('cors')
const port = 4000;
const bcrypt = require("bcrypt");


// loads environment variables from a .env
require('dotenv').config({ path: './config/.env' });

// database dependencies
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')
const dbConnect = require("./config/db/dbConnect");

// execute database connection 
dbConnect();

// User Schema
const User = require("./config/db/userModel");

app.use(cors())
app.use(express.json());

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    mongoOptions: {
      useUnifiedTopology: true
    }
  })
}));

app.get('/', (req, res) => {
  res.json('Hello World!');
});

// register endpoint
app.post("/register", (request, response) => {
  // hash the password
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });

      // save the new user
      user
        .save()
        // return success if the new user is added to the database successfully
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        // catch error if the new user wasn't added successfully to the database
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    // catch error if the password hash isn't successful
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
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
