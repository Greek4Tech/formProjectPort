const express = require('express');
const app = express();
const axios = require('axios')
const cors = require('cors')
const port = 4000;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const auth = require("./auth");

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
// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

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

app.post('/forgotpassword', (req, res) => {
  console.log(req.body)
  res.json('Hello, this endpoint work!');
});

// register endpoint
app.post("/register", (request, response) => {
  console.log(request.body)
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

// login endpoint
app.post("/login", (request, response) => {
  // check if email exists
  User.findOne({ email: request.body.email })

    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {

          // check if password matches
          if(!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          //   return success response
          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          });
        })
        // catch error if password does not match
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
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
