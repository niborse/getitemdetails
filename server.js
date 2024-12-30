const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3003;

// Enable CORS
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://nvborse1812:Iloveworkinginthecontrolroom@cluster1.tqaxbvl.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define the item schema
const itemSchema = new mongoose.Schema({
  class: String,
  name: String,
  price: Number,
  barcode: String
});

// Create the item model
const Item = mongoose.model('Item', itemSchema);

// API endpoint to get item details by class
app.get('/items/:class', async (req, res) => {
    const itemClass = req.params.class;
    console.log(`Received request for class: ${itemClass}`); // Log the requested class
    try {
      const item = await Item.findOne({ class: itemClass });
      if (item) {
        console.log(`Found item: ${item.name} - Class: ${item.class}`); // Log the found item
        res.json(item);
      } else {
        console.log(`No item found for class: ${itemClass}`); // Log when no item is found
        res.json({ name: 'Unknown', price: 0, barcode: '' });
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
      res.status(500).send('Server error');
    }
  });
  app.get('/items/barcode/:barcode', async (req, res) => {
    try {
        const barcode = req.params.barcode;
        const item = await Item.findOne({ barcode });
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
