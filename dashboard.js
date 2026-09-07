// dashboard.js — logic specific to dashboard.html
// Relies on functions already defined in script.js: getCurrentUser, getReviews, escapeHtml, openModal

function renderDashboard() {
  const guard = document.getElementById("dashboard-guard");
  const content = document.getElementById("dashboard-content");
  const currentUser = getCurrentUser();

  if (!currentUser) {
    guard.classList.remove("hidden");
    content.classList.add("hidden");
    return;
  }

  guard.classList.add("hidden");
  content.classList.remove("hidden");

  document.getElementById("dashboard-welcome-text").textContent = `Welcome back, ${currentUser.name.split(" ")[0]}`;
  document.getElementById("dashboard-role-badge").textContent =
    currentUser.role === "worker" ? "Service provider account" : "Customer account";

  document.getElementById("account-name").textContent = currentUser.name;
  document.getElementById("account-email").textContent = currentUser.email;
  document.getElementById("account-role").textContent =
    currentUser.role === "worker" ? "Worker" : "Customer";

  renderMyOrders(currentUser);
  renderMyReviews(currentUser);
}

function renderMyOrders(currentUser) {
  const list = document.getElementById("my-orders-list");
  const allOrders = getOrders();
  const myOrders = allOrders.filter((o) => o.customerEmail === currentUser.email);

  if (myOrders.length === 0) {
    list.innerHTML = `<p class="review-empty">You haven't contacted any workers yet. Browse workers on the homepage to get started.</p>`;
    return;
  }

  list.innerHTML = myOrders
    .map((order) => {
      const categoryLabel = order.category.replace("-", " ");
      const statusClass = order.status === "completed" ? "status-available" : "status-busy";
      const statusText = order.status === "completed" ? "Completed" : "In progress";
      const markDoneBtn =
        order.status === "in-progress"
          ? `<button class="mark-done-btn" data-order-id="${order.id}">Mark job as done</button>`
          : order.rated
          ? `<span class="order-rated-note">Rated ✓</span>`
          : `<span class="order-rated-note">Ready to rate — see below</span>`;

      return `
        <div class="order-card">
          <div class="order-top">
            <span class="order-worker">${escapeHtml(order.workerName)}</span>
            <span class="status-badge ${statusClass}">${statusText}</span>
          </div>
          <div class="order-category">${escapeHtml(categoryLabel)}</div>
          ${markDoneBtn}
        </div>
      `;
    })
    .join("");

  list.querySelectorAll(".mark-done-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const orderId = btn.getAttribute("data-order-id");
      updateOrderStatus(orderId, "completed");
      renderMyOrders(currentUser);
    });
  });
}

function renderMyReviews(currentUser) {
  const list = document.getElementById("my-reviews-list");
  const allReviews = getReviews();
  const myReviews = allReviews.filter((r) => r.reviewerEmail === currentUser.email);

  if (myReviews.length === 0) {
    list.innerHTML = `<p class="review-empty">You haven't left any reviews yet.</p>`;
    return;
  }

  list.innerHTML = myReviews
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

document.addEventListener("DOMContentLoaded", () => {
  renderDashboard();

  const dashboardLoginBtn = document.getElementById("dashboard-login-btn");
  if (dashboardLoginBtn) {
    dashboardLoginBtn.addEventListener("click", openModal);
  }

  const logoutBtn = document.getElementById("dashboard-logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("mela-current-user");
      renderDashboard();
      updateLoginButton();
    });
  }

  // Re-render dashboard right after a successful login/signup on this page
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  if (loginForm) loginForm.addEventListener("submit", () => setTimeout(renderDashboard, 0));
  if (signupForm) signupForm.addEventListener("submit", () => setTimeout(renderDashboard, 0));
});