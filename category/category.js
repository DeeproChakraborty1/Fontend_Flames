let products = [];
let cart = {};

// Fetch product data from JSON
fetch("products.json")
  .then(response => response.json())
  .then(data => {
    products = data;
    displayProducts(products);
  });

const productContainer = document.getElementById("products");
const categoryButtons = document.querySelectorAll("#categories button");
const minPriceInput = document.getElementById("min-price");
const maxPriceInput = document.getElementById("max-price");
const cartButton = document.getElementById("cart-button");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const applyFiltersButton = document.getElementById("apply-filters");
const closeCartButton = document.getElementById("close-cart");
const checkoutButton = document.getElementById("checkout-button");

let activeCategory = "all";

// display products
function displayProducts(items) {
  productContainer.innerHTML = "";
  items.forEach(product => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.addEventListener("click", () => {
      viewProductDetails(product.id);
    });

    productCard.innerHTML = `
                    <div>
                    <img src="${product.image}" alt="${product.name}" width="100">
                    <p>${product.rating}☆/5</p>
                    <h3>${product.name}</h3>
                    <p>Price: ₹${product.price}</p>
                    <p>Category: ${product.category}</p>
                    </div>
                    
                    <div>
                        <button onclick="addToCart(${product.id})" id="AddToCartBtn">Add to Cart</button>
                    </div>

                `;
    productContainer.appendChild(productCard);
  });
}

function viewProductDetails(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "product_details.html";
  }
}

function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
    updateCartCount();
  }
}

// Add to cart
function addToCart(productId) {
  event.stopPropagation();
  const product = products.find(p => p.id === productId);
  if (product) {
    if (cart[productId]) {
      cart[productId].quantity += 1;
    } else {
      cart[productId] = { ...product, quantity: 1 };
    }
    updateCartCount();
    saveCartToLocalStorage();
    alert(`${product.name} added to cart!`);
  }
}

// Update cart count
function updateCartCount() {
  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

// display cart
function displayCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  Object.values(cart).forEach(item => {
    total += item.price * item.quantity;
    const cartItem = document.createElement("li");
    cartItem.innerHTML = `
                    ${item.name} - ₹${item.price} x ${item.quantity}
                    <div class="removebtns">
                        <button onclick="updateCartItem(${item.id}, 'add')">+</button>
                        <button onclick="updateCartItem(${item.id}, 'subtract')">-</button>
                        <button onclick="removeCartItem(${item.id})">Remove</button>
                    </div>
                `;
    cartItemsContainer.appendChild(cartItem);
  });
  cartTotal.textContent = total;
}

// Update cart item quantity
function updateCartItem(productId, action) {
  if (cart[productId]) {
    if (action === "add") {
      cart[productId].quantity += 1;
    } else if (action === "subtract") {
      cart[productId].quantity -= 1;
      if (cart[productId].quantity <= 0) {
        delete cart[productId];
      }
    }
    updateCartCount();
    saveCartToLocalStorage();
    displayCart();
  }
}

// Remove cart item
function removeCartItem(productId) {
  if (cart[productId]) {
    delete cart[productId];
    updateCartCount();
    saveCartToLocalStorage();
    displayCart();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadCartFromLocalStorage();
});

// Checkout
function checkout() {
  if (Object.keys(cart).length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert("Thank you for your purchase!");
  cart = {};
  localStorage.removeItem('cart');
  updateCartCount();
  displayCart();
  cartModal.style.display = "none";
}

// Sort products
function sortProducts() {
  const sortOption = document.getElementById("sort-options").value;

  let sortedProducts = [...products]; 

  if (sortOption === "price-low-high") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-high-low") {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === "rating-high-low") {
    sortedProducts.sort((a, b) => b.rating - a.rating);
  } else if (sortOption === "rating-low-high") {
    sortedProducts.sort((a, b) => a.rating - b.rating);
  }

  displayProducts(sortedProducts); 
}

// // Filter products

function applyFilters() {
  const minPrice = parseFloat(minPriceInput.value) || 0;
  const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

  const filteredProducts = products.filter(product => {
    const inCategory = activeCategory === "all" || product.category === activeCategory;
    const inPriceRange = product.price >= minPrice && product.price <= maxPrice;
    return inCategory && inPriceRange;
  });

  // Apply sorting after filtering
  const sortOption = document.getElementById("sort-options").value;

  if (sortOption === "price-low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === "rating-high-low") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  } else if (sortOption === "rating-low-high") {
    filteredProducts.sort((a, b) => a.rating - b.rating);
  }

  displayProducts(filteredProducts);
}


// Handle category selection
categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    categoryButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.getAttribute("data-category");
    applyFilters();
  });
});

// Event listeners
applyFiltersButton.addEventListener("click", applyFilters);
cartButton.addEventListener("click", () => {
  cartModal.style.display = "block";
  displayCart();
});

closeCartButton.addEventListener("click", () => {
  cartModal.style.display = "none";
});
checkoutButton.addEventListener("click", checkout);

