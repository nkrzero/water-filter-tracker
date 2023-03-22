const mongoose = require('mongoose');

const filterSchema = new mongoose.Schema({
  name: String,
  installDate: Date,
  expirationDate: Date,
  first_installed: Date
});

const Filter = mongoose.model('Filter', filterSchema);
module.exports = Filter;
