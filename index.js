const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(morgan('dev')); // Morgan to log requests on server console
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Import Routes
// const listenerRoutes = require('./Routes/listener');

// DotENV config
require('dotenv').config();

// Connecting to Database
const dbUrl = process.env.DB_URL || '';
const dbName = process.env.DB_NAME || '';
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName,
  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch((error) => console.log('MongoDB Error:\n', error));
mongoose.set('useCreateIndex', true);

// CORS
app.use(cors()); // Enable All CORS Requests

const server = http.createServer(app);

// Import Routes
const quizRoutes = require('./Routes/quiz');
const submissionRoutes = require('./Routes/submit');
const resultRoutes = require('./Routes/results');

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Articuno server | 200 OK | @meet59patel',
  });
});

app.use('/addQuiz', quizRoutes); // addQuiz, getQuiz
app.use('/submission', submissionRoutes); // [POST]submitQuizAns
app.use('/results', resultRoutes); // [GET] getResults, [GET] getSubmission

// If request is able pass till here, route was not found. => Send 404 error
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Handle all the previous errors (including 404 and others)
app.use((error, req, res, next) => {
  console.log(req.body);
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const port = process.env.PORT || 4949;

server.listen(port, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${port}...`
  );
});
