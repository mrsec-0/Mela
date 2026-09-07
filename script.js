function renderAvailableCounts() {
  const countEls = document.querySelectorAll(".category-count");
  countEls.forEach((el) => {
    const key = el.getAttribute("data-count");
    const count = featuredWorkers.filter((w) => w.category === key && w.available).length;
    el.textContent = `${count} available`;
  });
}

// ---- Featured workers data ----
// Mock data for now — swap this for real data from a server later.
const featuredWorkers = [
  {
    name: "Abebe Kebede",
    category: "plumbers",
    rating: 4.8,
    reviewCount: 32,
    experience: 10,
    price: 450,
    available: true,
    bio: "Fixes leaks, installs pipes, and handles emergency call-outs.",
    color: "#e8622c"
  },
  {
    name: "Getachew Worku",
    category: "plumbers",
    rating: 4.5,
    reviewCount: 18,
    experience: 6,
    price: 350,
    available: false,
    bio: "Bathroom and kitchen plumbing installs, fast and tidy work.",
    color: "#e8622c"
  },
  {
    name: "Selam Tesfaye",
    category: "electricians",
    rating: 4.9,
    reviewCount: 21,
    experience: 8,
    price: 500,
    available: true,
    bio: "Licensed electrician specializing in home wiring and repairs.",
    color: "#3b82f6"
  },
  {
    name: "Dawit Mulu",
    category: "electricians",
    rating: 4.6,
    reviewCount: 14,
    experience: 5,
    price: 380,
    available: true,
    bio: "Wiring, outlet installs, and general electrical troubleshooting.",
    color: "#3b82f6"
  },
  {
    name: "Yonas Bekele",
    category: "cleaners",
    rating: 4.7,
    reviewCount: 48,
    experience: 4,
    price: 300,
    available: false,
    bio: "Deep cleaning and regular home upkeep, reliable and on time.",
    color: "#10b981"
  },
  {
    name: "Hana Girma",
    category: "cleaners",
    rating: 4.9,
    reviewCount: 36,
    experience: 7,
    price: 320,
    available: true,
    bio: "Move-in/move-out cleans and weekly household service.",
    color: "#10b981"
  },
  {
    name: "Marta Alemu",
    category: "photographers",
    rating: 5.0,
    reviewCount: 15,
    experience: 6,
    price: 1200,
    available: true,
    bio: "Weddings, events, and portraits — captured with care.",
    color: "#a855f7"
  },
  {
    name: "Kaleb Fikre",
    category: "photographers",
    rating: 4.6,
    reviewCount: 9,
    experience: 3,
    price: 800,
    available: false,
    bio: "Product and event photography with quick turnaround.",
    color: "#a855f7"
  },
  {
    name: "Rediet Assefa",
    category: "event-teams",
    rating: 4.8,
    reviewCount: 12,
    experience: 5,
    price: 2500,
    available: true,
    bio: "Full event setup, decor, and coordination for any occasion.",
    color: "#f59e0b"
  },
  {
    name: "Nathnael Girma",
    category: "event-teams",
    rating: 4.4,
    reviewCount: 7,
    experience: 3,
    price: 1800,
    available: true,
    bio: "Sound, lighting, and staging for parties and weddings.",
    color: "#f59e0b"
  }
];

let activeCategoryFilter = "all";

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function renderFilterStatus() {
  const statusEl = document.getElementById("workers-filter-status");
  if (!statusEl) return;

  if (activeCategoryFilter === "all") {
    statusEl.innerHTML = "";
    return;
  }

  const label = activeCategoryFilter.replace("-", " ");
  statusEl.innerHTML = `Showing <strong>${escapeHtml(label)}</strong> — <a href="#" id="clear-filter-link">show all</a>`;

  document.getElementById("clear-filter-link").addEventListener("click", (e) => {
    e.preventDefault();
    activeCategoryFilter = "all";
    renderWorkers();
    renderFilterStatus();
  });
}

function renderWorkers() {
  const grid = document.getElementById("workers-grid");
  if (!grid) return;

  const workersToShow =
    activeCategoryFilter === "all"
      ? featuredWorkers
      : featuredWorkers.filter((w) => w.category === activeCategoryFilter);

  if (workersToShow.length === 0) {
    grid.innerHTML = `<p class="review-empty">No workers listed in this category yet.</p>`;
    return;
  }

  grid.innerHTML = workersToShow
    .map((worker) => {
      const categoryLabel = worker.category.replace("-", " ");
      const expLabel = worker.experience === 1 ? "1 year" : `${worker.experience} years`;
      const statusClass = worker.available ? "status-available" : "status-busy";
      const statusText = worker.available ? "Available" : "Busy";
      const contactDisabled = worker.available ? "" : "disabled";
      const ratingDisplay =
        worker.reviewCount > 0
          ? `★ ${worker.rating.toFixed(1)}<span>(${worker.reviewCount} reviews)</span>`
          : `<span class="new-worker-badge">New</span>`;
      return `
        <div class="worker-card">
          <div class="worker-card-top">
            <div class="worker-avatar" style="background-color: ${worker.color}">
              ${getInitials(worker.name)}
            </div>
            <span class="status-badge ${statusClass}">${statusText}</span>
          </div>
          <div class="worker-name">${escapeHtml(worker.name)}</div>
          <span class="worker-category">${escapeHtml(categoryLabel)}</span>
          <div class="worker-rating">${ratingDisplay}</div>
          <div class="worker-experience">${expLabel} experience</div>
          <div class="worker-price">${worker.price} ETB <span>/ job</span></div>
          <p class="worker-bio">${escapeHtml(worker.bio)}</p>
          <button class="worker-contact-btn" data-worker-id="${featuredWorkers.indexOf(worker)}" ${contactDisabled}>${worker.available ? "Contact" : "Unavailable"}</button>
        </div>
      `;
    })
    .join("");
}

function setupCategoryFilters() {
  const cards = document.querySelectorAll(".category-card");
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const category = card.getAttribute("data-category");
      activeCategoryFilter = category;
      renderWorkers();
      renderFilterStatus();
      document.getElementById("workers-grid").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// ---- Orders: tracks which customer hired which worker ----
// An order must exist and be marked "completed" before that worker can be rated.
function getOrders() {
  const stored = localStorage.getItem("mela-orders");
  return stored ? JSON.parse(stored) : [];
}

function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem("mela-orders", JSON.stringify(orders));
}

function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
  localStorage.setItem("mela-orders", JSON.stringify(updated));
}

function setupContactButtons() {
  const grid = document.getElementById("workers-grid");
  if (!grid) return;

  // Event delegation, since worker cards get re-rendered on filter changes
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".worker-contact-btn");
    if (!btn || btn.disabled) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert("Please log in as a customer first to contact a worker.");
      openModal();
      return;
    }

    if (currentUser.role === "worker") {
      alert("This account is registered as a service provider. Contacting and hiring other workers is only available for customer accounts.");
      return;
    }

    const workerId = btn.getAttribute("data-worker-id");
    const worker = featuredWorkers[workerId];
    if (!worker) return;

    saveOrder({
      id: Date.now().toString(),
      customerEmail: currentUser.email,
      workerName: worker.name,
      category: worker.category,
      status: "in-progress",
      rated: false,
      date: new Date().toISOString()
    });

    alert(`You've contacted ${worker.name}. Once the job is done, mark it complete from your Dashboard so you can rate them.`);
  });
}

// ---- Star rating input ----
let selectedRating = 0;

function setupStarInput() {
  const starInput = document.getElementById("star-input");
  if (!starInput) return;

  const stars = starInput.querySelectorAll(".star");

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      selectedRating = parseInt(star.getAttribute("data-value"), 10);
      updateStarDisplay(stars, selectedRating);
    });

    star.addEventListener("mouseenter", () => {
      const hoverValue = parseInt(star.getAttribute("data-value"), 10);
      updateStarDisplay(stars, hoverValue);
    });
  });

  starInput.addEventListener("mouseleave", () => {
    updateStarDisplay(stars, selectedRating);
  });
}

function updateStarDisplay(stars, value) {
  stars.forEach((star) => {
    const starValue = parseInt(star.getAttribute("data-value"), 10);
    star.classList.toggle("selected", starValue <= value);
  });
}

// ---- Reviews: load, save, render ----
function getReviews() {
  const stored = localStorage.getItem("mela-reviews");
  return stored ? JSON.parse(stored) : [];
}

function saveReview(review) {
  const reviews = getReviews();
  reviews.unshift(review); // newest first
  localStorage.setItem("mela-reviews", JSON.stringify(reviews));
  recalculateWorkerRating(review.workerName, review.category);
  renderAvailableCounts();
  renderWorkers();
}

function renderReviews() {
  const list = document.getElementById("reviews-list");
  if (!list) return;

  const reviews = getReviews();

  if (reviews.length === 0) {
    list.innerHTML = `<p class="review-empty">No reviews yet — be the first to rate a worker!</p>`;
    return;
  }

  list.innerHTML = reviews
    .map((review) => {
      const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
      return `
        <div class="review-card">
          <div class="review-top">
            <span class="review-worker">${escapeHtml(review.workerName)}</span>
            <span class="review-stars">${stars}</span>
          </div>
          <div class="review-category">${escapeHtml(review.category).replace("-", " ")}</div>
          <p class="review-text">${escapeHtml(review.feedback)}</p>
        </div>
      `;
    })
    .join("");
}

// Basic escaping so user input can't break the HTML structure
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---- Form submission ----
function setupRateSection() {
  const guard = document.getElementById("rate-guard");
  const guardText = document.getElementById("rate-guard-text");
  const guardLoginBtn = document.getElementById("rate-guard-login-btn");
  const form = document.getElementById("rate-form");
  const select = document.getElementById("rateable-order-select");
  if (!form || !guard) return;

  refreshRateSection();

  guardLoginBtn.addEventListener("click", openModal);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const orderId = select.value;
    const orders = getOrders();
    const order = orders.find((o) => o.id === orderId);
    const feedback = document.getElementById("feedback-text").value.trim();

    if (!order || !feedback || selectedRating === 0) {
      alert("Please select an order, write feedback, and choose a star rating.");
      return;
    }

    const currentUser = getCurrentUser();

    saveReview({
      workerName: order.workerName,
      category: order.category,
      rating: selectedRating,
      feedback,
      date: new Date().toISOString(),
      reviewerName: currentUser.name,
      reviewerEmail: currentUser.email
    });

    updateOrderStatus(order.id, "completed"); // stays completed
    markOrderRated(order.id);

    form.reset();
    selectedRating = 0;
    updateStarDisplay(document.querySelectorAll(".star"), 0);

    renderReviews();
    refreshRateSection();

    function markOrderRated(id) {
      const all = getOrders();
      const updated = all.map((o) => (o.id === id ? { ...o, rated: true } : o));
      localStorage.setItem("mela-orders", JSON.stringify(updated));
    }
  });

  function refreshRateSection() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      guard.classList.remove("hidden");
      form.classList.add("hidden");
      guardText.textContent = "Log in to rate a worker you've hired.";
      guardLoginBtn.classList.remove("hidden");
      return;
    }

    if (currentUser.role === "worker") {
      guard.classList.remove("hidden");
      form.classList.add("hidden");
      guardLoginBtn.classList.add("hidden");
      guardText.textContent = "Rating is only available for customer accounts. This account is registered as a service provider.";
      return;
    }

    const rateableOrders = getOrders().filter(
      (o) => o.customerEmail === currentUser.email && o.status === "completed" && !o.rated
    );

    if (rateableOrders.length === 0) {
      guard.classList.remove("hidden");
      form.classList.add("hidden");
      guardLoginBtn.classList.add("hidden");
      guardText.textContent = "You don't have any completed orders to rate yet. Contact a worker, and once the job is marked done from your Dashboard, you can rate them here.";
      return;
    }

    guard.classList.add("hidden");
    form.classList.remove("hidden");

    select.innerHTML = rateableOrders
      .map((o) => `<option value="${o.id}">${escapeHtml(o.workerName)} — ${escapeHtml(o.category.replace("-", " "))}</option>`)
      .join("");
  }
}

function recalculateWorkerRating(workerName, category) {
  const reviews = getReviews().filter((r) => r.workerName === workerName && r.category === category);
  const worker = featuredWorkers.find((w) => w.name === workerName && w.category === category);
  if (!worker || reviews.length === 0) return;

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  worker.rating = Math.round(avg * 10) / 10;
  worker.reviewCount = reviews.length;
}

// ---- Login / Sign up modal ----
function openModal() {
  document.getElementById("auth-modal-overlay").classList.add("open");
}

function closeModal() {
  document.getElementById("auth-modal-overlay").classList.remove("open");
}

function switchTab(tab) {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const loginTabBtn = document.getElementById("tab-login-btn");
  const signupTabBtn = document.getElementById("tab-signup-btn");

  if (tab === "login") {
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
    loginTabBtn.classList.add("active");
    signupTabBtn.classList.remove("active");
  } else {
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    signupTabBtn.classList.add("active");
    loginTabBtn.classList.remove("active");
  }
}

function getUsers() {
  const stored = localStorage.getItem("mela-users");
  return stored ? JSON.parse(stored) : [];
}

function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem("mela-users", JSON.stringify(users));
}

function setCurrentUser(user) {
  localStorage.setItem("mela-current-user", JSON.stringify(user));
}

function getCurrentUser() {
  const stored = localStorage.getItem("mela-current-user");
  return stored ? JSON.parse(stored) : null;
}

function updateLoginButton() {
  const loginBtn = document.getElementById("login-open-btn");
  if (!loginBtn) return;

  const currentUser = getCurrentUser();
  if (currentUser) {
    loginBtn.textContent = `Hi, ${currentUser.name.split(" ")[0]}`;
  } else {
    loginBtn.textContent = "Login";
  }
}

function setupAuthModal() {
  const openBtn = document.getElementById("login-open-btn");
  const closeBtn = document.getElementById("modal-close-btn");
  const overlay = document.getElementById("auth-modal-overlay");
  const loginTabBtn = document.getElementById("tab-login-btn");
  const signupTabBtn = document.getElementById("tab-signup-btn");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  if (!openBtn) return;

  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const currentUser = getCurrentUser();
    if (currentUser) {
      const stayLoggedIn = confirm(`Logged in as ${currentUser.name}. Log out?`);
      if (stayLoggedIn) {
        localStorage.removeItem("mela-current-user");
        updateLoginButton();
      }
      return;
    }
    openModal();
  });

  closeBtn.addEventListener("click", closeModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  loginTabBtn.addEventListener("click", () => switchTab("login"));
  signupTabBtn.addEventListener("click", () => switchTab("signup"));

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const errorEl = document.getElementById("login-error");

    const users = getUsers();
    const match = users.find((u) => u.email === email && u.password === password);

    if (!match) {
      errorEl.textContent = "No account found with that email and password.";
      return;
    }

    errorEl.textContent = "";
    setCurrentUser(match);
    updateLoginButton();
    closeModal();
    loginForm.reset();
  });

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const role = document.getElementById("signup-role").value;
    const errorEl = document.getElementById("signup-error");

    if (password.length < 6) {
      errorEl.textContent = "Password must be at least 6 characters.";
      return;
    }

    const users = getUsers();
    if (users.some((u) => u.email === email)) {
      errorEl.textContent = "An account with that email already exists.";
      return;
    }

    errorEl.textContent = "";
    const newUser = { name, email, password, role };
    saveUser(newUser);
    setCurrentUser(newUser);
    updateLoginButton();
    closeModal();
    signupForm.reset();
  });
}

// ---- List your services modal ----
const categoryColors = {
  "plumbers": "#e8622c",
  "electricians": "#3b82f6",
  "cleaners": "#10b981",
  "photographers": "#a855f7",
  "event-teams": "#f59e0b"
};

function openListServiceModal() {
  document.getElementById("list-service-modal-overlay").classList.add("open");
}

function closeListServiceModal() {
  document.getElementById("list-service-modal-overlay").classList.remove("open");
}

function setupListServiceModal() {
  const openBtns = [
    document.getElementById("list-service-open-btn"),
    document.getElementById("footer-list-service-btn"),
    document.getElementById("how-it-works-list-service-btn")
  ];
  const closeBtn = document.getElementById("list-service-close-btn");
  const overlay = document.getElementById("list-service-modal-overlay");
  const form = document.getElementById("list-service-form");

  openBtns.forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openListServiceModal();
    });
  });

  closeBtn.addEventListener("click", closeListServiceModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeListServiceModal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("worker-form-name").value.trim();
    const phone = document.getElementById("worker-form-phone").value.trim();
    const category = document.getElementById("worker-form-category").value;
    const experience = parseInt(document.getElementById("worker-form-experience").value, 10);
    const price = parseInt(document.getElementById("worker-form-price").value, 10);
    const bio = document.getElementById("worker-form-bio").value.trim();
    const errorEl = document.getElementById("list-service-error");

    if (!name || !phone || !category || !bio || isNaN(experience) || isNaN(price)) {
      errorEl.textContent = "Please fill in every field.";
      return;
    }

    errorEl.textContent = "";

    featuredWorkers.push({
      name,
      category,
      rating: 0,
      reviewCount: 0,
      experience,
      price,
      available: true,
      bio,
      phone,
      color: categoryColors[category] || "#e8622c"
    });

    renderAvailableCounts();
    activeCategoryFilter = category;
    renderWorkers();
    renderFilterStatus();

    form.reset();
    closeListServiceModal();
    alert(`Thanks, ${name}! You're now listed under ${category.replace("-", " ")}.`);
    document.getElementById("workers-grid").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
  renderAvailableCounts();
  renderWorkers();
  setupCategoryFilters();
  setupContactButtons();
  setupStarInput();
  setupRateSection();
  renderReviews();
  setupAuthModal();
  updateLoginButton();
  setupListServiceModal();
});