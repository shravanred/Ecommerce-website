let cart = [];
let selectedCategory = 'all'; 
let currentIndex = 0; 
const itemsPerLoad = 10; 

const productsContainer = document.getElementById('products');
const loadMoreBtn = document.getElementById('load-more');
const sortSelect = document.getElementById('sort');
const errorDiv = document.getElementById('error');
const categoryFiltersContainer = document.getElementById('category-filters');
const productDetail = document.getElementById('product-detail');
const backBtn = document.querySelector('.back-btn');
const detailImageMain = document.getElementById('detail-image-main');
const detailTitle = document.getElementById('detail-title');
const detailPrice = document.getElementById('detail-price');
const detailDescription = document.getElementById('detail-description');
const thumbnails = document.querySelectorAll('.thumbnail');
const addToCartBtn = document.querySelector('.add-to-cart');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const searchInput = document.getElementById('search');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsDiv = document.getElementById('cart-items');
const cartTotalDiv = document.getElementById('cart-total');
const categoryTitle = document.getElementById('category-title');
const signInSection = document.getElementById('sign-in');
const registerSection = document.getElementById('register');
const toRegisterLink = document.getElementById('to-register');
const toSignInLink = document.getElementById('to-signin');
const footerSignInLink = document.getElementById('footer-signin');
const footerRegisterLink = document.getElementById('footer-register');
const contentSection = document.querySelector('.content');
const detailsSection = document.getElementById('details');
const detailsForm = document.getElementById('details-form');
const paymentSection = document.getElementById('payment');
const paymentForm = document.getElementById('payment-form');
const paymentSuccess = document.getElementById('payment-success');
const proceedToPaymentBtn = document.getElementById('proceed-to-payment');


const nameError = document.getElementById('name-error');
const phoneError = document.getElementById('phone-error');
const addressError = document.getElementById('address-error');
const zipcodeError = document.getElementById('zipcode-error');
const cardError = document.getElementById('card-error');
const expiryError = document.getElementById('expiry-error');
const cvvError = document.getElementById('cvv-error');

let allProducts = [];
let displayedProducts = [];

async function fetchProducts() {
  try {
    productsContainer.innerHTML = '<div class="shimmer"></div>'.repeat(
      itemsPerLoad
    );
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) throw new Error('Network error');
    allProducts = await response.json();
    populateCategories();
    loadMoreProducts();
  } catch (error) {
    showError('Failed to load products. Please try again later.');
  }
}

function populateCategories() {
  const categories = [
    ...new Set(allProducts.map((product) => product.category)),
  ];
  categoryFiltersContainer.innerHTML = ''; 
  categories.forEach((category) => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = category;
    checkbox.setAttribute('data-category', category);
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(` ${category}`));
    categoryFiltersContainer.appendChild(label);
  });

  categoryFiltersContainer
    .querySelectorAll('input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        currentIndex = 0;
        updateCategoryDisplay();
      });
    });
}

function loadMoreProducts() {
  const startIndex = currentIndex;
  const endIndex = currentIndex + itemsPerLoad;
  const filteredProducts = filterAndSortProducts(
    searchInput.value.trim(),
    selectedCategory
  ).slice(startIndex, endIndex);

  if (startIndex === 0) {
    displayedProducts = filteredProducts;
    displayProducts(displayedProducts);
  } else {
    displayedProducts = [...displayedProducts, ...filteredProducts];
    displayProducts(displayedProducts);
  }

  currentIndex = endIndex;
  const remainingProducts =
    filterAndSortProducts(searchInput.value.trim(), selectedCategory).length -
    currentIndex;
  loadMoreBtn.disabled =
    remainingProducts <= 0 || remainingProducts < itemsPerLoad; 
}

function displayProducts(products) {
  productsContainer.innerHTML = products
    .map(
      (product) => `
    <div class="product-card" data-id="${product.id}">
      <img src="${product.image}" alt="${product.title}" loading="lazy">
      <h3>${product.title}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <div class="wishlist"><i class="fas fa-heart"></i></div>
    </div>
  `
    )
    .join('');

 
  document.querySelectorAll('.product-card').forEach((card) => {
    card.addEventListener('click', () => {
      const productId = card.getAttribute('data-id');
      const product = allProducts.find((p) => p.id == productId);
      showProductDetail(product);
    });
  });
}

function filterAndSortProducts(searchTerm = '', category = 'all') {
  let filtered = [...allProducts];

  if (searchTerm) {
    filtered = filtered.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }


  if (category !== 'all') {
    filtered = filtered.filter((product) => product.category === category);
  } else {
    const checkedCategories = Array.from(
      document.querySelectorAll('#category-filters input:checked')
    ).map((input) => input.value);
    if (checkedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        checkedCategories.includes(product.category)
      );
    }
  }
  if (filtered.length === 0 && checkedCategories.length > 0) {
    categoryTitle.textContent = 'No products found';
  } else if (category !== 'all') {
    categoryTitle.textContent = `${
      category.charAt(0).toUpperCase() + category.slice(1)
    }`;
  } else {
    categoryTitle.textContent = 'All Products';
  }

  const sortValue = sortSelect.value;
  if (sortValue === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  }

  return filtered;
}

function updateCategoryDisplay() {
  currentIndex = 0;
  loadMoreProducts();
}

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  productsContainer.innerHTML = '';
}

function showProductDetail(product) {

  contentSection.style.display = 'none';
  signInSection.style.display = 'none';
  registerSection.style.display = 'none';
  detailsSection.style.display = 'none';
  paymentSection.style.display = 'none';
  productDetail.style.display = 'block';

  detailImageMain.src = product.image;
  detailTitle.textContent = product.title;
  detailPrice.textContent = `$${product.price.toFixed(2)}`;
  detailDescription.textContent = product.description;


  thumbnails.forEach((thumb, index) => {
    thumb.src = product.image;
  });


  thumbnails.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      detailImageMain.src = thumb.src;
    });
  });


  addToCartBtn.onclick = () => {
    const cartItem = cart.find((item) => item.id === product.id);
    if (cartItem) {
      cartItem.quantity += 1; 
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        image: product.image, 
      });
    }
    updateCartCount();
    updateCartModal();
 
  };
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.innerHTML = `<i class="fas fa-shopping-cart"></i> ${totalItems}`;
}

function updateCartModal() {
  cartItemsDiv.innerHTML = '';
  let total = 0;
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="cart-item-info">
        <p><strong>${item.title}</strong></p>
        <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
        <p>Subtotal: $${itemTotal.toFixed(2)}</p>
      </div>
      <div class="cart-item-actions">
        <button onclick="addToCart(${item.id})">Add</button>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
    cartItemsDiv.appendChild(div);
  });
  cartTotalDiv.textContent = `Total: $${total.toFixed(2)}`;
  proceedToPaymentBtn.disabled = cart.length === 0; 
}

function addToCart(productId) {
  const product = allProducts.find((p) => p.id === productId);
  const cartItem = cart.find((item) => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.image, 
    });
  }
  updateCartCount();
  updateCartModal();
  console.log('Added to cart:', product.title);
}

function removeFromCart(productId) {
  const cartItem = cart.find((item) => item.id === productId);
  if (cartItem) {
    cartItem.quantity -= 1;
    if (cartItem.quantity === 0) {
      cart = cart.filter((item) => item.id !== productId);
    }
  }
  updateCartCount();
  updateCartModal();
  console.log(
    'Removed from cart:',
    cartItem ? cartItem.title : 'Item not found'
  ); 
}

cartCount.addEventListener('click', () => {
  if (cart.length > 0) {
    updateCartModal();
    cartModal.style.display = 'flex';
  } else {
    alert('Your cart is empty!');
  }
});

closeCartBtn.addEventListener('click', () => {
  cartModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === cartModal) {
    cartModal.style.display = 'none';
  }
});

backBtn.addEventListener('click', () => {
  productDetail.style.display = 'none';
  contentSection.style.display = 'block';
  signInSection.style.display = 'none';
  registerSection.style.display = 'none';
  detailsSection.style.display = 'none';
  paymentSection.style.display = 'none';
  selectedCategory = 'all';
  currentIndex = 0;
  updateCategoryDisplay();
});

sortSelect.addEventListener('change', () => {
  currentIndex = 0;
  updateCategoryDisplay();
});

searchInput.addEventListener('input', () => {
  currentIndex = 0; 
  updateCategoryDisplay();
});


document.querySelectorAll('.nav-menu a').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    selectedCategory = link.getAttribute('data-category');
    currentIndex = 0;
    contentSection.style.display = 'block';
    productDetail.style.display = 'none';
    signInSection.style.display = 'none';
    registerSection.style.display = 'none';
    detailsSection.style.display = 'none';
    paymentSection.style.display = 'none';
    updateCategoryDisplay();
  });
});

loadMoreBtn.addEventListener('click', () => {
  loadMoreProducts();
});


categoryFiltersContainer.addEventListener('change', (e) => {
  if (e.target.type === 'checkbox') {
    currentIndex = 0; 
    updateCategoryDisplay();
  }
});


function showSection(section) {
  contentSection.style.display = 'none';
  productDetail.style.display = 'none';
  signInSection.style.display = 'none';
  registerSection.style.display = 'none';
  detailsSection.style.display = 'none';
  paymentSection.style.display = 'none';
  section.style.display = 'block';


  const filters = document.querySelector('.filters');
  if (section.id === 'details' || section.id === 'payment') {
    filters.style.display = 'none';
  } else {
    filters.style.display = 'block';
  }
}

footerSignInLink.addEventListener('click', (e) => {
  e.preventDefault();
  showSection(signInSection);
});

footerRegisterLink.addEventListener('click', (e) => {
  e.preventDefault();
  showSection(registerSection);
});

toRegisterLink.addEventListener('click', (e) => {
  e.preventDefault();
  showSection(registerSection);
});

toSignInLink.addEventListener('click', (e) => {
  e.preventDefault();
  showSection(signInSection);
});


proceedToPaymentBtn.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Proceed to Payment button clicked');
  if (!proceedToPaymentBtn.disabled) {
    cartModal.style.display = 'none';
    showSection(detailsSection);
  }
});


detailsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const zipcode = document.getElementById('zipcode').value;


  const nameValid = /^[A-Za-z\s]{2,}$/.test(name);
  const phoneValid = /^\d{10}$/.test(phone);
  const addressValid = /^[A-Za-z0-9\s.,#-]{5,}$/.test(address);
  const zipcodeValid = /^\d{6}$/.test(zipcode);


  nameError.style.display = 'none';
  phoneError.style.display = 'none';
  addressError.style.display = 'none';
  zipcodeError.style.display = 'none';

  let isValid = true;

  if (!nameValid) {
    nameError.style.display = 'block';
    isValid = false;
  }
  if (!phoneValid) {
    phoneError.style.display = 'block';
    isValid = false;
  }
  if (!addressValid) {
    addressError.style.display = 'block';
    isValid = false;
  }
  if (!zipcodeValid) {
    zipcodeError.style.display = 'block';
    isValid = false;
  }

  if (isValid) {
    showSection(paymentSection);
  }
});


paymentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Payment form submitted'); 
  const cardNumber = document.getElementById('card-number').value;
  const expiryDate = document.getElementById('expiry-date').value;
  const cvv = document.getElementById('cvv').value;


  const cardNumberValid = /^\d{12,19}$/.test(cardNumber);
  const expiryDateValid = /^(0[1-9]|1[0-2])\/[2-9][0-9]$/.test(expiryDate);
  const cvvValid = /^\d{3}$/.test(cvv);


  cardError.style.display = 'none';
  expiryError.style.display = 'none';
  cvvError.style.display = 'none';

  let isValid = true;

  if (!cardNumberValid) {
    cardError.style.display = 'block';
    isValid = false;
  }
  if (!expiryDateValid) {
    expiryError.style.display = 'block';
    isValid = false;
  }
  if (!cvvValid) {
    cvvError.style.display = 'block';
    isValid = false;
  }

  console.log('Validation result:', {
    cardNumberValid,
    expiryDateValid,
    cvvValid,
  }); 

  if (isValid) {
    console.log('Payment validated successfully');
    paymentSuccess.style.display = 'block';
    
    const transactionId = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();
    const successModal = document.getElementById('success-modal');
    const transactionIdSpan = document.getElementById('transaction-id');
    transactionIdSpan.textContent = transactionId;
    successModal.style.display = 'flex';
    console.log('Modal displayed with transaction ID:', transactionId); 
    setTimeout(() => {
      successModal.style.display = 'none';
      showSection(contentSection);
      cart = []; 
      paymentForm.reset();
      updateCartCount();
      console.log('Modal closed, cart cleared'); 
    }, 5000); 
  }
});


hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

fetchProducts();
