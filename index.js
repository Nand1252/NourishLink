const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const server = http.createServer(app);

const io = socketIO(server);
app.set('io', io);

// In-memory storage for food items
const foodItems = [];

// Serve index.html as the home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Serve browse.html for browsing available food items
app.get('/food-items', (req, res) => {
  res.send(`
    <div id="container"></div>
    <script>
    //let jsonData = foodItems;

    let container = document.getElementById("container");
    let table = document.createElement("table");
    let cols = Object.keys(jsonData[0]);
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    cols.forEach((item) => {
      let th = document.createElement("th");
      th.innerText = item;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.append(tr)
    jsonData.forEach((item) => {
      let tr = document.createElement("tr");
      let vals = Object.values(item);
      vals.forEach((elem) => {
        let td = document.createElement("td");
        td.innerText = elem;
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
    container.appendChild(table)
  </script>
  `)
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

  // Emit an event to notify clients about the new food item
  const io = req.app.get('io');
  io.emit('newFoodItem', newFoodItem);
  res.sendFile(__dirname + '/public/donate.html');
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