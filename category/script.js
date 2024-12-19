let products = [];
    let cart = {};

    // Fetch product data from JSON
    fetch("products.json")
      .then(response => response.json())
      .then(data => {
        products = data;
        renderProducts(products);
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

    // Render products
    function renderProducts(items) {
      productContainer.innerHTML = "";
      items.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.addEventListener("click", () => {
          viewProductDetails(product.id);
        });
        
        productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" width="100">
                    <h3>${product.name}</h3>
                    <p>Price: ₹${product.price}</p>
                    <p>Category: ${product.category}</p>
                    <button onclick="addToCart(${product.id})">Add to Cart</button>

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
        alert(`${product.name} added to cart!`);
      }
    }

    // Update cart count
    function updateCartCount() {
      const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
    }

    // Render cart
    function renderCart() {
      cartItemsContainer.innerHTML = "";
      let total = 0;
      Object.values(cart).forEach(item => {
        total += item.price * item.quantity;
        const cartItem = document.createElement("li");
        cartItem.innerHTML = `
                    ${item.name} - ₹${item.price} x ${item.quantity}
                    <div>
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
        renderCart();
      }
    }

    // Remove cart item
    function removeCartItem(productId) {
      if (cart[productId]) {
        delete cart[productId];
        updateCartCount();
        renderCart();
      }
    }

    // Checkout
    function checkout() {
      if (Object.keys(cart).length === 0) {
        alert("Your cart is empty!");
        return;
      }

      alert("Thank you for your purchase!");
      cart = {};
      updateCartCount();
      renderCart();
      cartModal.style.display = "none";
    }

    // Filter products
    function applyFilters() {
      const minPrice = parseFloat(minPriceInput.value) || 0;
      const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

      const filteredProducts = products.filter(product => {
        const inCategory = activeCategory === "all" || product.category === activeCategory;
        const inPriceRange = product.price >= minPrice && product.price <= maxPrice;
        return inCategory && inPriceRange;
      });

      renderProducts(filteredProducts);
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
      renderCart();
    });
    closeCartButton.addEventListener("click", () => {
      cartModal.style.display = "none";
    });
    checkoutButton.addEventListener("click", checkout);