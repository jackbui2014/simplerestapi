const express = require('express');
const debug = require('debug')('app');
const mongoose = require('mongoose');
if( process.env.ENV === 'Test'){
  console.log('This is testing');
  const db = mongoose.connect('mongodb://localhost/bookAPI_Test');  
}
else{
  console.log('This is production');
  const db = mongoose.connect('mongodb://localhost/bookAPI');
}
const Book = require('./src/models/bookModel');
const bookRouter = require('./src/routers/bookRouter')(Book);

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', bookRouter);
app.get('/', (req, res) => {
  res.send('Welcome to my API');
});

app.server = app.listen(port, () => {
  debug(`Running on port ${port}`);
});

module.exports = app;