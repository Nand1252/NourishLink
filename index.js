const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory storage for food items
const foodItems = [];

// Serve index.html as the home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Serve browse.html for browsing available food items
app.get('/browse', (req, res) => {
  res.sendFile(__dirname + '/public/browse.html');
});

// Serve donate.html for donating a food item
app.get('/donate', (req, res) => {
  res.sendFile(__dirname + '/public/donate.html');
});

app.get('/request/:id', (req, res) => {
  const itemId = req.params.id;
  const item = foodItems.find(item => item.id === itemId);

  if (!item || item.status !== 'available') {
    res.send(`
      <h2>Food item not found or not available!</h2>
    `);
  } else {
    res.sendFile(__dirname + '/public/request.html');
  }
});

// API endpoint to create a new food donation
app.post('/donate', (req, res) => {
  const { title, description, quantity } = req.body;
  const id = uuid.v4();

  const newFoodItem = {
    id,
    title,
    description,
    quantity,
    status: 'available',
    createdAt: new Date(),
  };

  foodItems.push(newFoodItem);

  res.send(`
    <h2>Food item donated successfully!</h2>
    <p>ID: ${id}</p>
    <a href="/">Back</a>
  `);
});

// API endpoint to request a food item
app.post('/request/:id', (req, res) => {
  const itemId = req.params.id;
  const requesterName = req.body.name;

  const item = foodItems.find(item => item.id === itemId);

  if (!item || item.status !== 'available') {
    res.send(`
      <h2>Food item not found or not available!</h2>
    `);
  } else {
    item.status = 'requested';
    item.requesterName = requesterName;

    res.send(`
      <h2>Food item requested successfully!</h2>
      <p>Item ID: ${itemId}</p>
      <p>Requester Name: ${requesterName}</p>
    `);
  }
});

// ...

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});