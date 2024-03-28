let cartItems = []; 

function addToCart(productName, price) {
    const existingItemIndex = cartItems.findIndex(item => item.name === productName);
    if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity++;
    } else {
        cartItems.push({ name: productName, price: price, quantity: 1 });
    }
    displayCartPopup();
    updateCartCount(); // Update the cart count
}

function updateCartCount() {
    const cartCountElement = document.querySelector('#cartCountPopup');
    const cartButton = document.querySelector('.btnCart-popup');
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = cartCount;
    cartButton.textContent = `Cart (${cartCount})`;
}

function displayCartPopup() {
    const cartElement = document.querySelector('#cartPopup');
    const cartCountElement = document.querySelector('#cartCountPopup');
    const totalPriceElement = document.getElementById('totalPricePopup');

    cartElement.innerHTML = '';
    let totalPrice = 0;

    const cartTable = document.createElement('table');
    cartTable.innerHTML = `
        <tr>
            <th>Fruit</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Price</th>
        </tr>
    `;

    cartItems.forEach(item => {
        const totalProductPrice = item.price * item.quantity;
        totalPrice += totalProductPrice;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>
                <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(this.value, '${item.name}', ${item.price})">
            </td>
            <td>$${item.price}</td>
            <td>$${totalProductPrice}</td>
        `;
        cartTable.appendChild(tr);
    });

    cartElement.appendChild(cartTable);
    cartCountElement.textContent = cartItems.length;
    totalPriceElement.textContent = `Total Price: $${totalPrice}`;

    // Show the popup and overlay
    document.querySelector('.popup').style.display = 'block';
    document.querySelector('.popup-overlay').style.display = 'block';
}

function closePopup() {
    document.querySelector('.popup').style.display = 'none';
    document.querySelector('.popup-overlay').style.display = 'none';
}

function updateQuantity(newQuantity, productName, price) {
    const itemIndex = cartItems.findIndex(item => item.name === productName);
    if (itemIndex !== -1) {
        cartItems[itemIndex].quantity = parseInt(newQuantity);
    }
    displayCartPopup();
}

async function submitOrder() {
    const databaseUrl = 'https://rosesellingwebsite-default-rtdb.firebaseio.com/chatMsg.json';

    const timestamp = new Date().toLocaleString();

    const orderData = {
        timestamp: timestamp,
        items: {}
    };

    cartItems.forEach(item => {
        orderData.items[item.name] = {
            price: item.price,
            quantity: item.quantity
        };
    });

    try {
        const response = await fetch(databaseUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }
        cartItems = [];
        displayCartPopup(); // To update cart with order submission status
        alert('Order submitted successfully!');
    } catch (error) {
        console.error('Error submitting order:', error);
        alert('Failed to submit order. Please try again later.');
    }   
}

document.addEventListener('DOMContentLoaded', function() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
      button.onclick = function() {
          const productName = button.getAttribute('data-product');
          const productPrice = parseFloat(button.getAttribute('data-price'));
          addToCart(productName, productPrice);
      };
  });

  document.querySelector('#submitPopup').onclick = submitOrder;
  document.querySelector('#closePopup').onclick = closePopup;
});
