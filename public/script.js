document.addEventListener('DOMContentLoaded', () => {
    const foodItemsList = document.getElementById('foodItemsList');
  
    const fetchFoodItems = () => {
      fetch('/food-items')
        .then(response => response.json())
        .then(data => {
          foodItemsList.innerHTML = '';
          data.forEach(foodItem => {
            const itemElement = document.createElement('li');
            itemElement.innerHTML = `<b>Title:</b> ${foodItem.title}<br><b>Description:</b> ${foodItem.description}<br><b>Quantity:</b> ${foodItem.quantity}`;
            foodItemsList.appendChild(itemElement);
          });
        });
    };
  
    fetchFoodItems();
  
    // Set interval to fetch and update the food items every 5 seconds
    setInterval(fetchFoodItems, 5000);
  });