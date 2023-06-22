document.addEventListener('DOMContentLoaded', () => {
    const foodItemsTable = document.getElementById('foodItemsTable');
    const tbody = foodItemsTable.querySelector('tbody');
  
    const updateFoodItemsTable = (data) => {
        tbody.innerHTML = '';
        data.forEach(foodItem => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${foodItem.title}</td>
            <td>${foodItem.description}</td>
            <td>${foodItem.quantity}</td>
          `;
          tbody.appendChild(row);
        });
      };
    
      const socket = io();
      socket.on('newFoodItem', () => {
        fetch('/food-items')
          .then(response => response.json())
          .then(data => {
            updateFoodItemsTable(data);
          })
          .catch(error => {
            console.error('Error fetching food items:', error);
          });
      });
    
      fetch('/food-items')
        .then(response => response.json())
        .then(data => {
          updateFoodItemsTable(data);
        })
        .catch(error => {
          console.error('Error fetching food items:', error);
        });
  
    const form = document.getElementById('donateForm');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const title = document.getElementById('titleInput').value;
      const description = document.getElementById('descriptionInput').value;
      const quantity = document.getElementById('quantityInput').value;
  
      axios.post('/donate', { title, description, quantity })
        .then(response => {
          const data = response.data;
          if (data.success) {
            thankYouMessage.style.display = 'block';
          }
        })
        .catch(error => {
          console.error('Error making donation:', error);
        });
    });
  });