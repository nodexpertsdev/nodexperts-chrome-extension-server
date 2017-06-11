const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
  title: {
    type: String, required: true
  },
  description: {
    type: String, required: true
  },
  url: {
    type: String, required: true
  },
  url: {
    type: String, required: true
  },
  category: {
    type: String, required: true
  },
  created_at: {
    type: Date, default: new Date()
  },
  img_url: {
    type: String
  }
});
