const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const TransactionModel = require('./models/Transaction.js');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL ).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

app.get('/api/test', (req, res) => {
  res.json({ body: 'test OK' });
});


app.post('/api/transaction', async (req, res) => {
  try {
    const { name, description, price, datetime } = req.body;

    if (!name || !description || !price || !datetime) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const transaction = await TransactionModel.create({ name, description, price, datetime });
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/transactions', async(req, res)=>{
 await mongoose.connect(process.env.MONGO_URL);
 const transactions = await TransactionModel.find();
 res.json(transactions);
})
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
