const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const socketIO = require('socket.io');
const http = require('http');
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const server = http.createServer(app);

let foodListHtml = fs.readFileSync('./public/browse.html', 'utf8');

// In-memory storage for food items
const foodItems = [];

const generateFoodHtmlArray = () => {
  return foodItems.map((item) => {
    let output = foodListHtml.replace('{{%TITLE%}}', item.title);
    output = output.replace('{{%DESCRIPTION%}}', item.description);
    output = output.replace('{{%QUANTITY%}}', item.quantity);
    output = output.replace('{{%STATUS%}}', item.status);
  
    return output;
  });
};

// Serve index.html as the home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Serve donate.html for donating a food item
app.get('/donate', (req, res) => {
  res.sendFile(__dirname + '/public/donate.html');
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
    status: 'available'
  };

  foodItems.push(newFoodItem);

  const foodHtmlArray = generateFoodHtmlArray();

  fs.truncate('./public/data.json', 0, (err) => {
    if (err) throw err;
  })

  fs.writeFile('./public/data.json', JSON.stringify(newFoodItem, null, 2), (err) => {
    if (err) throw err;
  });
  
  res.sendFile(__dirname + '/public/donate.html');
});

// Serve browse.html for browsing available food items
app.get('/food-items', (req, res) => {
  const foodHtmlArray = generateFoodHtmlArray();

  res.send(foodHtmlArray.join(''));
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});