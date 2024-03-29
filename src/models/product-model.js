// src/models/product-model.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Creating product schema
const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  }
});

const product = mongoose.model('product_List', productSchema);
module.exports = product;
