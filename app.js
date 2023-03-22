const express = require('express');
const mongoose = require('mongoose');
const filtersRouter = require('./routes/filters');
const app = express();

mongoose.connect('mongodb://localhost/filter_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/', filtersRouter);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
