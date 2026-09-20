// Cars19 Interactive Application Logic with Multi-Account Switching & Dark Mode Support

// State Management
const appState = {
  activeView: "home",
  darkMode: false,
  accounts: [...INITIAL_ACCOUNTS],
  currentAccountId: "acc-rahul",
  user: { ...INITIAL_ACCOUNTS[0] },
  favorites: [...INITIAL_ACCOUNTS[0].favorites],
  bookings: [...INITIAL_ACCOUNTS[0].bookings],
  selectedCarForBooking: null,
  activeDetailCar: null,
  bookingForm: {
    pickupLocation: "New Delhi - IGI International Airport (DEL)",
    returnLocation: "New Delhi - IGI International Airport (DEL)",
    pickupDate: "",
    returnDate: "",
    pickupTime: "10:00",
    returnTime: "10:00",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    licenseNumber: "",
    paymentMethod: "card"
  },
  currentBookingStep: 1,
  lastConfirmedBooking: null
};

// Initialize dates & saved preferences
function initDates() {
  const today = new Date();
  const nextDay = new Date();
  nextDay.setDate(today.getDate() + 3);

  const format = (d) => d.toISOString().split("T")[0];
  appState.bookingForm.pickupDate = format(today);
  appState.bookingForm.returnDate = format(nextDay);

  // Sync user booking details
  appState.bookingForm.customerName = appState.user.name;
  appState.bookingForm.customerEmail = appState.user.email;
  appState.bookingForm.customerPhone = appState.user.phone;
  appState.bookingForm.licenseNumber = appState.user.license;

  // Restore dark mode preference
  const savedDark = localStorage.getItem("cars19_dark_mode");
  if (savedDark === "true") {
    setDarkMode(true);
  }
}

// Dark Mode Toggle
function toggleDarkMode() {
  setDarkMode(!appState.darkMode);
}

function setDarkMode(enable) {
  appState.darkMode = enable;
  localStorage.setItem("cars19_dark_mode", enable);

  const icon = document.getElementById("theme-toggle-icon");
  if (enable) {
    document.body.classList.add("dark-mode");
    if (icon) icon.setAttribute("data-lucide", "sun");
    showToast("Dark mode activated");
  } else {
    document.body.classList.remove("dark-mode");
    if (icon) icon.setAttribute("data-lucide", "moon");
    showToast("Light mode activated");
  }
  lucide.createIcons();
}

// Multiple Account Switching Logic
function switchAccount(accountId) {
  const targetAcc = appState.accounts.find((a) => a.id === accountId);
  if (!targetAcc) return;

  // Save changes to current account first
  const currentAcc = appState.accounts.find((a) => a.id === appState.currentAccountId);
  if (currentAcc) {
    currentAcc.favorites = [...appState.favorites];
    currentAcc.bookings = [...appState.bookings];
  }

  // Activate target account
  appState.currentAccountId = targetAcc.id;
  appState.user = { ...targetAcc };
  appState.favorites = [...targetAcc.favorites];
  appState.bookings = [...targetAcc.bookings];

  // Update booking forms
  appState.bookingForm.customerName = targetAcc.name;
  appState.bookingForm.customerEmail = targetAcc.email;
  appState.bookingForm.customerPhone = targetAcc.phone;
  appState.bookingForm.licenseNumber = targetAcc.license;

  closeAccountDropdown();
  updateUserStatusUI();

  if (appState.activeView === "home") renderPopularCars();
  if (appState.activeView === "cars") applyFleetFilters();
  if (appState.activeView === "dashboard") renderDashboard();

  showToast(`Switched account to ${targetAcc.name} (${targetAcc.badge})`);
  lucide.createIcons();
}

function toggleAccountDropdown() {
  const dd = document.getElementById("account-dropdown");
  if (dd) dd.classList.toggle("open");
}

function closeAccountDropdown() {
  const dd = document.getElementById("account-dropdown");
  if (dd) dd.classList.remove("open");
}

function addNewAccount(e) {
  e.preventDefault();
  const name = document.getElementById("new-acc-name")?.value.trim();
  const email = document.getElementById("new-acc-email")?.value.trim();
  const phone = document.getElementById("new-acc-phone")?.value.trim();
  const license = document.getElementById("new-acc-license")?.value.trim();
  const badge = document.getElementById("new-acc-badge")?.value || "Personal";

  if (!name || !email || !license) {
    showToast("Please fill all required profile fields", "warning");
    return;
  }

  const newAcc = {
    id: "acc-" + Math.floor(1000 + Math.random() * 9000),
    name,
    email,
    phone: phone || "+91 99999 88888",
    license,
    badge,
    role: badge === "Business Corporate" ? "Corporate Travel" : "Individual Driver",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    favorites: [],
    bookings: []
  };

  appState.accounts.push(newAcc);
  closeAuthModal();
  switchAccount(newAcc.id);
  showToast(`Account for ${name} registered and activated!`);
}

// Router & View Switcher
function navigateTo(viewId, param = null) {
  appState.activeView = viewId;
  window.location.hash = viewId;

  // Hide all view pages
  document.querySelectorAll(".page-view").forEach((view) => {
    view.style.display = "none";
  });

  // Highlight Nav Links
  document.querySelectorAll(".nav-link, .mobile-nav-link").forEach((link) => {
    if (link.dataset.target === viewId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Close mobile drawer if open
  closeMobileNav();
  closeAccountDropdown();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (viewId === "home") {
    const homeView = document.getElementById("view-home");
    if (homeView) homeView.style.display = "block";
    renderPopularCars();
    lucide.createIcons();
  } else if (viewId === "cars") {
    const carsView = document.getElementById("view-cars");
    if (carsView) carsView.style.display = "block";
    applyFleetFilters();
  } else if (viewId === "booking") {
    const bookingView = document.getElementById("view-booking");
    if (bookingView) bookingView.style.display = "block";
    if (param && typeof param === "string") {
      const car = CARS_DATABASE.find((c) => c.id === param);
      if (car) appState.selectedCarForBooking = car;
    }
    if (!appState.selectedCarForBooking) {
      appState.selectedCarForBooking = CARS_DATABASE[0];
    }
    initBookingWizard();
  } else if (viewId === "dashboard") {
    const dashView = document.getElementById("view-dashboard");
    if (dashView) dashView.style.display = "block";
    renderDashboard();
  } else if (viewId === "about") {
    const aboutView = document.getElementById("view-about");
    if (aboutView) aboutView.style.display = "block";
  } else if (viewId === "how-it-works") {
    const howView = document.getElementById("view-how-it-works");
    if (howView) howView.style.display = "block";
  } else if (viewId === "contact") {
    const contactView = document.getElementById("view-contact");
    if (contactView) contactView.style.display = "block";
  }
  lucide.createIcons();
}

// Utility: Format Currency INR
function formatINR(val) {
  return "₹" + Number(val).toLocaleString("en-IN");
}

// Utility: Date difference in days
function calculateRentalDays(startDate, endDate) {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

// Render Popular Cars on Home Page
function renderPopularCars() {
  const container = document.getElementById("popular-cars-grid");
  if (!container) return;

  const populars = CARS_DATABASE.filter((car) => car.isPopular).slice(0, 6);
  container.innerHTML = populars.map((car) => createCarCardHTML(car)).join("");
}

// Create Card HTML
function createCarCardHTML(car) {
  const isFav = appState.favorites.includes(car.id);
  return `
    <div class="car-card" data-car-id="${car.id}">
      <div class="car-card-media">
        <img src="${car.heroImage}" alt="${car.name}" loading="lazy" />
        ${car.tag ? `<div class="car-card-tag">${car.tag}</div>` : ""}
        <button class="car-card-favorite-btn ${isFav ? "favorited" : ""}" onclick="toggleFavorite('${car.id}', event)" title="Save Car">
          <i data-lucide="heart" style="${isFav ? "fill: #ef4444; color: #ef4444;" : ""}"></i>
        </button>
      </div>
      <div class="car-card-body">
        <div class="car-card-meta">
          <span class="car-category">${car.category}</span>
          <div class="car-rating">
            <i data-lucide="star"></i>
            <span>${car.rating}</span>
            <span style="color: var(--text-muted); font-weight: normal; font-size: 0.78rem;">(${car.reviewCount})</span>
          </div>
        </div>
        <h3 class="car-name">${car.name}</h3>

        <div class="car-specs-grid">
          <div class="spec-item">
            <span class="spec-label">Transmission</span>
            <span class="spec-value"><i data-lucide="gauge"></i> ${car.transmission}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Fuel Type</span>
            <span class="spec-value"><i data-lucide="fuel"></i> ${car.fuelType}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Capacity</span>
            <span class="spec-value"><i data-lucide="users"></i> ${car.seats} Seats</span>
          </div>
        </div>

        <div class="car-card-footer">
          <div class="car-price-box">
            <span class="price-main">${formatINR(car.pricePerDay)}</span>
            <span class="price-unit">per day (taxes extra)</span>
          </div>
          <div class="car-card-actions">
            <button class="btn btn-outline btn-sm" onclick="openCarDetailsModal('${car.id}')">View Details</button>
            <button class="btn btn-primary btn-sm" onclick="startBookingForCar('${car.id}')">Book Now</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Toggle Favorite
function toggleFavorite(carId, event) {
  if (event) event.stopPropagation();
  const index = appState.favorites.indexOf(carId);
  if (index > -1) {
    appState.favorites.splice(index, 1);
    showToast("Vehicle removed from saved list");
  } else {
    appState.favorites.push(carId);
    showToast("Vehicle saved to favorites!");
  }
  if (appState.activeView === "home") renderPopularCars();
  if (appState.activeView === "cars") applyFleetFilters();
  if (appState.activeView === "dashboard") renderDashboard();
  lucide.createIcons();
}

// Car Details Modal Management
function openCarDetailsModal(carId) {
  const car = CARS_DATABASE.find((c) => c.id === carId);
  if (!car) return;
  appState.activeDetailCar = car;

  const modal = document.getElementById("car-details-modal");
  const modalContent = document.getElementById("car-details-body");

  // Calculate pricing breakdown based on current booking form dates
  const days = calculateRentalDays(appState.bookingForm.pickupDate, appState.bookingForm.returnDate);
  const baseRate = car.pricePerDay * days;
  const taxes = Math.round(baseRate * 0.18);
  const total = baseRate + taxes;

  modalContent.innerHTML = `
    <div class="car-detail-layout">
      <div>
        <div class="detail-gallery-main">
          <img id="detail-main-photo" src="${car.heroImage}" alt="${car.name}" />
        </div>
        <div class="detail-thumbnails">
          ${car.gallery.map((imgUrl, idx) => `
            <div class="thumbnail-item ${idx === 0 ? "active" : ""}" onclick="switchDetailPhoto('${imgUrl}', this)">
              <img src="${imgUrl}" alt="${car.name} photo ${idx + 1}" />
            </div>
          `).join("")}
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
          <span class="badge badge-orange">${car.category}</span>
          <div class="car-rating" style="font-size: 1.05rem;">
            <i data-lucide="star"></i>
            <span>${car.rating}</span>
            <span style="color: var(--text-muted); font-size: 0.9rem;">(${car.reviewCount} verified reviews)</span>
          </div>
        </div>

        <h2 style="font-size: 2rem; font-weight: 800; color: var(--navy-dark); margin-bottom: 0.75rem;">${car.name}</h2>
        <p style="color: var(--text-muted); line-height: 1.65; margin-bottom: 1.5rem;">${car.description}</p>

        <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--navy-dark); margin-bottom: 0.75rem;">Vehicle Specifications</h3>
        <div class="detail-specs-table">
          <div class="detail-spec-box">
            <span class="detail-spec-title">Fuel Type</span>
            <div class="detail-spec-val"><i data-lucide="fuel" style="color: var(--orange-accent); width: 16px; display: inline;"></i> ${car.fuelType}</div>
          </div>
          <div class="detail-spec-box">
            <span class="detail-spec-title">Transmission</span>
            <div class="detail-spec-val"><i data-lucide="gauge" style="color: var(--orange-accent); width: 16px; display: inline;"></i> ${car.transmission}</div>
          </div>
          <div class="detail-spec-box">
            <span class="detail-spec-title">Seating Capacity</span>
            <div class="detail-spec-val"><i data-lucide="users" style="color: var(--orange-accent); width: 16px; display: inline;"></i> ${car.seats} Passengers</div>
          </div>
          <div class="detail-spec-box">
            <span class="detail-spec-title">Fuel Economy</span>
            <div class="detail-spec-val"><i data-lucide="zap" style="color: var(--orange-accent); width: 16px; display: inline;"></i> ${car.mileage}</div>
          </div>
          <div class="detail-spec-box">
            <span class="detail-spec-title">Climate Control</span>
            <div class="detail-spec-val"><i data-lucide="wind" style="color: var(--orange-accent); width: 16px; display: inline;"></i> ${car.airConditioning}</div>
          </div>
          <div class="detail-spec-box">
            <span class="detail-spec-title">Luggage Capacity</span>
            <div class="detail-spec-val"><i data-lucide="briefcase" style="color: var(--orange-accent); width: 16px; display: inline;"></i> ${car.luggage}</div>
          </div>
        </div>
      </div>

      <!-- Right Column: Interactive Booking Calculator -->
      <div class="booking-calc-panel">
        <div class="calc-price-header">
          <div class="calc-daily-price">
            ${formatINR(car.pricePerDay)} <span>/ day</span>
          </div>
          <span class="badge badge-success">Instant Confirmation</span>
        </div>

        <div class="form-group">
          <label><i data-lucide="map-pin"></i> Pick-up Location</label>
          <select id="modal-loc" class="form-control" onchange="syncLocation(this.value)">
            ${LOCATIONS.map((loc) => `<option value="${loc}" ${loc === appState.bookingForm.pickupLocation ? "selected" : ""}>${loc}</option>`).join("")}
          </select>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
          <div class="form-group">
            <label><i data-lucide="calendar"></i> Pick-up Date</label>
            <input type="date" id="modal-pickup" class="form-control" value="${appState.bookingForm.pickupDate}" onchange="recalculateModalPrice(this.value, null)" />
          </div>
          <div class="form-group">
            <label><i data-lucide="calendar"></i> Return Date</label>
            <input type="date" id="modal-return" class="form-control" value="${appState.bookingForm.returnDate}" onchange="recalculateModalPrice(null, this.value)" />
          </div>
        </div>

        <div class="calc-breakdown">
          <div class="calc-row">
            <span>Rental Duration:</span>
            <span id="calc-days-display" style="font-weight: 700; color: var(--navy-dark);">${days} Days</span>
          </div>
          <div class="calc-row">
            <span>Daily Rate:</span>
            <span>${formatINR(car.pricePerDay)} × <span id="calc-days-multi">${days}</span></span>
          </div>
          <div class="calc-row">
            <span>Estimated Taxes (GST 18%):</span>
            <span id="calc-tax-display">${formatINR(taxes)}</span>
          </div>
          <div class="calc-row">
            <span>Refundable Deposit:</span>
            <span style="color: var(--success); font-weight: 600;">${formatINR(car.securityDeposit)} (Refunded at return)</span>
          </div>
          <div class="calc-row total">
            <span>Total Estimated:</span>
            <span id="calc-total-display">${formatINR(total)}</span>
          </div>
        </div>

        <button class="btn btn-primary btn-block btn-lg" onclick="closeCarDetailsModal(); startBookingForCar('${car.id}')">
          Reserve This Car <i data-lucide="arrow-right"></i>
        </button>

        <div style="font-size: 0.78rem; color: var(--text-muted); text-align: center; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
          <i data-lucide="shield-check" style="color: var(--success);"></i> Free cancellation up to 6 hours before pickup
        </div>
      </div>
    </div>
  `;

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
  lucide.createIcons();
}

function switchDetailPhoto(src, el) {
  const mainImg = document.getElementById("detail-main-photo");
  if (mainImg) mainImg.src = src;
  document.querySelectorAll(".thumbnail-item").forEach((thumb) => thumb.classList.remove("active"));
  el.classList.add("active");
}

function recalculateModalPrice(pickup, ret) {
  if (pickup) appState.bookingForm.pickupDate = pickup;
  if (ret) appState.bookingForm.returnDate = ret;

  const car = appState.activeDetailCar;
  if (!car) return;

  const days = calculateRentalDays(appState.bookingForm.pickupDate, appState.bookingForm.returnDate);
  const baseRate = car.pricePerDay * days;
  const taxes = Math.round(baseRate * 0.18);
  const total = baseRate + taxes;

  const daysDisp = document.getElementById("calc-days-display");
  const daysMulti = document.getElementById("calc-days-multi");
  const taxDisp = document.getElementById("calc-tax-display");
  const totalDisp = document.getElementById("calc-total-display");

  if (daysDisp) daysDisp.textContent = `${days} Days`;
  if (daysMulti) daysMulti.textContent = days;
  if (taxDisp) taxDisp.textContent = formatINR(taxes);
  if (totalDisp) totalDisp.textContent = formatINR(total);
}

function syncLocation(val) {
  appState.bookingForm.pickupLocation = val;
  appState.bookingForm.returnLocation = val;
}

function closeCarDetailsModal() {
  const modal = document.getElementById("car-details-modal");
  if (modal) modal.classList.remove("open");
  document.body.style.overflow = "";
}

// Start Booking from any Card
function startBookingForCar(carId) {
  const car = CARS_DATABASE.find((c) => c.id === carId);
  if (car) appState.selectedCarForBooking = car;
  appState.currentBookingStep = 1;
  navigateTo("booking");
}

// Dedicated Fleet Page Filters & Sorting
function applyFleetFilters() {
  const container = document.getElementById("fleet-cars-grid");
  if (!container) return;

  const searchQuery = (document.getElementById("fleet-search-input")?.value || "").toLowerCase().trim();
  const selectedCategory = document.getElementById("fleet-category-filter")?.value || "all";
  const selectedTransmission = document.getElementById("fleet-transmission-filter")?.value || "all";
  const selectedFuel = document.getElementById("fleet-fuel-filter")?.value || "all";
  const selectedSeats = document.getElementById("fleet-seats-filter")?.value || "all";
  const maxPrice = Number(document.getElementById("fleet-price-range")?.value || 10000);
  const sortBy = document.getElementById("fleet-sort-select")?.value || "recommended";

  let results = CARS_DATABASE.filter((car) => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery) || car.brand.toLowerCase().includes(searchQuery) || car.category.toLowerCase().includes(searchQuery);
    const matchesCategory = selectedCategory === "all" || car.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesTransmission = selectedTransmission === "all" || car.transmission.toLowerCase() === selectedTransmission.toLowerCase();
    const matchesFuel = selectedFuel === "all" || car.fuelType.toLowerCase() === selectedFuel.toLowerCase();
    const matchesSeats = selectedSeats === "all" || String(car.seats) === selectedSeats;
    const matchesPrice = car.pricePerDay <= maxPrice;

    return matchesSearch && matchesCategory && matchesTransmission && matchesFuel && matchesSeats && matchesPrice;
  });

  // Sorting
  if (sortBy === "price-asc") {
    results.sort((a, b) => a.pricePerDay - b.pricePerDay);
  } else if (sortBy === "price-desc") {
    results.sort((a, b) => b.pricePerDay - a.pricePerDay);
  } else if (sortBy === "popularity") {
    results.sort((a, b) => b.reviewCount - a.reviewCount);
  } else {
    results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
  }

  // Update counter
  const counter = document.getElementById("fleet-count-display");
  if (counter) counter.textContent = results.length;

  if (results.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
        <i data-lucide="car-off" style="width: 48px; height: 48px; color: var(--text-light); margin-bottom: 1rem;"></i>
        <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--navy-dark); margin-bottom: 0.5rem;">No vehicles match your criteria</h3>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Try resetting your filters or adjusting your budget range to view available options.</p>
        <button class="btn btn-outline" onclick="resetFleetFilters()">Reset All Filters</button>
      </div>
    `;
  } else {
    container.innerHTML = results.map((car) => createCarCardHTML(car)).join("");
  }
  lucide.createIcons();
}

function resetFleetFilters() {
  const searchInput = document.getElementById("fleet-search-input");
  const categoryFilter = document.getElementById("fleet-category-filter");
  const transFilter = document.getElementById("fleet-transmission-filter");
  const fuelFilter = document.getElementById("fleet-fuel-filter");
  const seatsFilter = document.getElementById("fleet-seats-filter");
  const priceRange = document.getElementById("fleet-price-range");
  const priceDisplay = document.getElementById("price-range-val");

  if (searchInput) searchInput.value = "";
  if (categoryFilter) categoryFilter.value = "all";
  if (transFilter) transFilter.value = "all";
  if (fuelFilter) fuelFilter.value = "all";
  if (seatsFilter) seatsFilter.value = "all";
  if (priceRange) priceRange.value = 10000;
  if (priceDisplay) priceDisplay.textContent = "₹10,000";

  applyFleetFilters();
  showToast("Filters reset to default");
}

// 5-Step Booking Flow Logic
function initBookingWizard() {
  const step = appState.currentBookingStep;
  renderBookingStep(step);
}

function goToBookingStep(stepNumber) {
  if (stepNumber > appState.currentBookingStep) {
    if (appState.currentBookingStep === 2) {
      const pDate = document.getElementById("wizard-pickup-date")?.value;
      const rDate = document.getElementById("wizard-return-date")?.value;
      if (!pDate || !rDate) {
        showToast("Please select valid pickup and return dates", "warning");
        return;
      }
      appState.bookingForm.pickupDate = pDate;
      appState.bookingForm.returnDate = rDate;
    } else if (appState.currentBookingStep === 3) {
      const name = document.getElementById("cust-name")?.value.trim();
      const email = document.getElementById("cust-email")?.value.trim();
      const phone = document.getElementById("cust-phone")?.value.trim();
      const license = document.getElementById("cust-license")?.value.trim();

      if (!name || !email || !phone || !license) {
        showToast("Please fill all required customer information fields", "warning");
        return;
      }
      appState.bookingForm.customerName = name;
      appState.bookingForm.customerEmail = email;
      appState.bookingForm.customerPhone = phone;
      appState.bookingForm.licenseNumber = license;
    }
  }

  appState.currentBookingStep = stepNumber;
  renderBookingStep(stepNumber);
  window.scrollTo({ top: 120, behavior: "smooth" });
}

function renderBookingStep(step) {
  // Update progress bar
  for (let i = 1; i <= 5; i++) {
    const node = document.getElementById(`step-node-${i}`);
    if (!node) continue;
    if (i < step) {
      node.className = "wizard-step-node completed";
      node.querySelector(".node-circle").innerHTML = `<i data-lucide="check" style="width: 18px; height: 18px;"></i>`;
    } else if (i === step) {
      node.className = "wizard-step-node active";
      node.querySelector(".node-circle").textContent = i;
    } else {
      node.className = "wizard-step-node";
      node.querySelector(".node-circle").textContent = i;
    }
  }

  const fill = document.getElementById("wizard-fill");
  if (fill) {
    const percentages = [0, 0, 25, 50, 75, 100];
    fill.style.width = `${percentages[step]}%`;
  }

  const car = appState.selectedCarForBooking || CARS_DATABASE[0];
  const days = calculateRentalDays(appState.bookingForm.pickupDate, appState.bookingForm.returnDate);
  const baseRate = car.pricePerDay * days;
  const taxes = Math.round(baseRate * 0.18);
  const total = baseRate + taxes;

  const contentContainer = document.getElementById("wizard-content-area");
  const summaryContainer = document.getElementById("wizard-summary-area");

  // Summary Sidebar
  if (summaryContainer) {
    if (step === 5) {
      summaryContainer.style.display = "none";
    } else {
      summaryContainer.style.display = "block";
      summaryContainer.innerHTML = `
        <div class="wizard-summary-card">
          <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--navy-dark); margin-bottom: 1rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem;">
            Rental Summary
          </h3>
          <div style="border-radius: var(--radius-md); overflow: hidden; height: 140px; margin-bottom: 1rem;">
            <img src="${car.heroImage}" alt="${car.name}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.25rem;">
            <span class="badge badge-orange">${car.category}</span>
            <span style="font-size: 0.85rem; font-weight: 700; color: var(--navy-dark);">${car.rating} ★</span>
          </div>
          <h4 style="font-size: 1.25rem; font-weight: 800; color: var(--navy-dark); margin-bottom: 1rem;">${car.name}</h4>

          <div class="calc-breakdown">
            <div class="calc-row">
              <span>Location:</span>
              <span style="font-weight: 600; color: var(--navy-dark); text-align: right; max-width: 160px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${appState.bookingForm.pickupLocation.split("-")[0]}
              </span>
            </div>
            <div class="calc-row">
              <span>Rental Period:</span>
              <span style="font-weight: 600; color: var(--navy-dark);">${days} ${days === 1 ? "day" : "days"}</span>
            </div>
            <div class="calc-row">
              <span>Daily Rate:</span>
              <span>${formatINR(car.pricePerDay)}/day</span>
            </div>
            <div class="calc-row">
              <span>Base Rent:</span>
              <span>${formatINR(baseRate)}</span>
            </div>
            <div class="calc-row">
              <span>Taxes (18% GST):</span>
              <span>${formatINR(taxes)}</span>
            </div>
            <div class="calc-row">
              <span>Refundable Deposit:</span>
              <span style="color: var(--success); font-weight: 600;">${formatINR(car.securityDeposit)}</span>
            </div>
            <div class="calc-row total">
              <span>Estimated Total:</span>
              <span>${formatINR(total)}</span>
            </div>
          </div>
        </div>
      `;
    }
  }

  // Wizard Step Content
  if (!contentContainer) return;

  if (step === 1) {
    contentContainer.innerHTML = `
      <div class="wizard-card">
        <h2 class="wizard-step-title">Step 1: Confirm Your Chosen Car</h2>
        <p class="wizard-step-sub">Review vehicle attributes or switch to another model from our fleet.</p>

        <div style="display: grid; grid-template-columns: 180px 1fr; gap: 1.5rem; background: var(--bg-subtle); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); margin-bottom: 1.5rem;">
          <div style="height: 120px; border-radius: var(--radius-md); overflow: hidden;">
            <img src="${car.heroImage}" alt="${car.name}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div>
            <span class="badge badge-orange" style="margin-bottom: 0.5rem;">${car.category}</span>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--navy-dark);">${car.name}</h3>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 0.75rem;">${car.transmission} • ${car.fuelType} • ${car.seats} Seats • ${car.mileage}</p>
            <span style="font-size: 1.25rem; font-weight: 800; color: var(--orange-accent);">${formatINR(car.pricePerDay)}</span> / day
          </div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button class="btn btn-outline" onclick="navigateTo('cars')">Choose Different Car</button>
          <button class="btn btn-primary" onclick="goToBookingStep(2)">Proceed to Rental Details <i data-lucide="arrow-right"></i></button>
        </div>
      </div>
    `;
  } else if (step === 2) {
    contentContainer.innerHTML = `
      <div class="wizard-card">
        <h2 class="wizard-step-title">Step 2: Rental Dates & Location</h2>
        <p class="wizard-step-sub">Select your trip schedule and preferred pickup & drop-off destinations.</p>

        <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 2rem;">
          <div class="form-group">
            <label><i data-lucide="map-pin"></i> Pick-up Location</label>
            <select id="wizard-loc" class="form-control" onchange="syncLocation(this.value)">
              ${LOCATIONS.map((loc) => `<option value="${loc}" ${loc === appState.bookingForm.pickupLocation ? "selected" : ""}>${loc}</option>`).join("")}
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
            <div class="form-group">
              <label><i data-lucide="calendar"></i> Pick-up Date</label>
              <input type="date" id="wizard-pickup-date" class="form-control" value="${appState.bookingForm.pickupDate}" onchange="updateWizardDates(this.value, null)" />
            </div>
            <div class="form-group">
              <label><i data-lucide="clock"></i> Pick-up Time</label>
              <input type="time" id="wizard-pickup-time" class="form-control" value="${appState.bookingForm.pickupTime}" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
            <div class="form-group">
              <label><i data-lucide="calendar"></i> Return Date</label>
              <input type="date" id="wizard-return-date" class="form-control" value="${appState.bookingForm.returnDate}" onchange="updateWizardDates(null, this.value)" />
            </div>
            <div class="form-group">
              <label><i data-lucide="clock"></i> Return Time</label>
              <input type="time" id="wizard-return-time" class="form-control" value="${appState.bookingForm.returnTime}" />
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: space-between;">
          <button class="btn btn-outline" onclick="goToBookingStep(1)"><i data-lucide="arrow-left"></i> Back</button>
          <button class="btn btn-primary" onclick="goToBookingStep(3)">Continue to Customer Details <i data-lucide="arrow-right"></i></button>
        </div>
      </div>
    `;
  } else if (step === 3) {
    const custName = appState.bookingForm.customerName || appState.user.name;
    const custEmail = appState.bookingForm.customerEmail || appState.user.email;
    const custPhone = appState.bookingForm.customerPhone || appState.user.phone;
    const custLicense = appState.bookingForm.licenseNumber || appState.user.license;

    contentContainer.innerHTML = `
      <div class="wizard-card">
        <h2 class="wizard-step-title">Step 3: Customer Information</h2>
        <p class="wizard-step-sub">Active Account: <strong>${appState.user.name}</strong> (${appState.user.badge}). Verify your credentials below.</p>

        <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 2rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
            <div class="form-group">
              <label><i data-lucide="user"></i> Full Name (as per Govt ID) *</label>
              <input type="text" id="cust-name" class="form-control" placeholder="e.g. Rahul Sharma" value="${custName}" required />
            </div>
            <div class="form-group">
              <label><i data-lucide="mail"></i> Email Address *</label>
              <input type="email" id="cust-email" class="form-control" placeholder="e.g. rahul.sharma@example.com" value="${custEmail}" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
            <div class="form-group">
              <label><i data-lucide="phone"></i> Phone Number *</label>
              <input type="tel" id="cust-phone" class="form-control" placeholder="e.g. +91 98765 43210" value="${custPhone}" required />
            </div>
            <div class="form-group">
              <label><i data-lucide="credit-card"></i> Driving License Number *</label>
              <input type="text" id="cust-license" class="form-control" placeholder="e.g. DL-1420180092144" value="${custLicense}" required />
            </div>
          </div>

          <div style="background: var(--bg-subtle); border-radius: var(--radius-md); padding: 1rem; border: 1px solid var(--border-subtle); font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.65rem;">
            <i data-lucide="shield-check" style="color: var(--success); width: 22px; height: 22px; flex-shrink: 0;"></i>
            <span>Your personal data and driver records are encrypted and protected under Cars19 Privacy Trust protocols.</span>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: space-between;">
          <button class="btn btn-outline" onclick="goToBookingStep(2)"><i data-lucide="arrow-left"></i> Back</button>
          <button class="btn btn-primary" onclick="goToBookingStep(4)">Proceed to Payment <i data-lucide="arrow-right"></i></button>
        </div>
      </div>
    `;
  } else if (step === 4) {
    contentContainer.innerHTML = `
      <div class="wizard-card">
        <h2 class="wizard-step-title">Step 4: Secure Payment</h2>
        <p class="wizard-step-sub">Select your preferred payment gateway. Transaction is secured with 256-bit bank-grade encryption.</p>

        <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 2rem;">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
            <label style="border: 2px solid var(--orange-accent); border-radius: var(--radius-md); padding: 1.25rem 1rem; text-align: center; cursor: pointer; background: var(--orange-light);">
              <input type="radio" name="pay-method" value="card" checked style="accent-color: var(--orange-accent); margin-bottom: 0.5rem;" />
              <div style="font-weight: 700; color: var(--navy-dark); font-size: 0.95rem;">Credit / Debit Card</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Visa, MasterCard, Amex</div>
            </label>

            <label style="border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem 1rem; text-align: center; cursor: pointer; background: var(--bg-card);">
              <input type="radio" name="pay-method" value="upi" style="accent-color: var(--orange-accent); margin-bottom: 0.5rem;" />
              <div style="font-weight: 700; color: var(--navy-dark); font-size: 0.95rem;">Instant UPI</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">GPay, PhonePe, Paytm</div>
            </label>

            <label style="border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem 1rem; text-align: center; cursor: pointer; background: var(--bg-card);">
              <input type="radio" name="pay-method" value="netbanking" style="accent-color: var(--orange-accent); margin-bottom: 0.5rem;" />
              <div style="font-weight: 700; color: var(--navy-dark); font-size: 0.95rem;">Net Banking</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">40+ Major Banks</div>
            </label>
          </div>

          <!-- Mock Card Details -->
          <div style="display: flex; flex-direction: column; gap: 1rem; background: var(--bg-subtle); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
            <div class="form-group">
              <label>Card Number</label>
              <input type="text" class="form-control" placeholder="4532 •••• •••• 8920" value="4532 8921 7843 8920" />
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label>Expiry Date</label>
                <input type="text" class="form-control" placeholder="MM/YY" value="08/29" />
              </div>
              <div class="form-group">
                <label>CVV / CVC</label>
                <input type="password" class="form-control" placeholder="•••" value="894" />
              </div>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: space-between;">
          <button class="btn btn-outline" onclick="goToBookingStep(3)"><i data-lucide="arrow-left"></i> Back</button>
          <button class="btn btn-primary btn-lg" onclick="processConfirmBooking()">
            Confirm & Pay ${formatINR(total)} <i data-lucide="shield-check"></i>
          </button>
        </div>
      </div>
    `;
  } else if (step === 5) {
    const booking = appState.lastConfirmedBooking;
    if (!booking) {
      contentContainer.innerHTML = `<p>Booking confirmed. Check your dashboard for details.</p>`;
      return;
    }

    contentContainer.innerHTML = `
      <div class="wizard-card confirmation-box" style="grid-column: 1 / -1; max-width: 800px; margin: 0 auto;">
        <div class="confirmed-icon-badge">
          <i data-lucide="check" style="width: 38px; height: 38px;"></i>
        </div>
        <h2 style="font-size: 2.25rem; font-weight: 800; color: var(--navy-dark); margin-bottom: 0.5rem;">Booking Confirmed!</h2>
        <p style="color: var(--text-muted); font-size: 1.05rem;">Thank you, ${booking.customerName}. Your reservation is officially secured under your ${appState.user.badge} account.</p>

        <!-- Printable Receipt Card -->
        <div class="receipt-card" id="printable-receipt">
          <div class="receipt-header">
            <div>
              <div class="brand-logo" style="font-size: 1.35rem; margin-bottom: 0.3rem;">
                <span class="logo-cars">Cars</span><span class="logo-19">19</span>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-muted);">Official Rental Reservation Receipt</p>
            </div>
            <div style="text-align: right;">
              <span class="receipt-id">${booking.bookingId}</span>
              <div style="font-size: 0.8rem; color: var(--success); font-weight: 700;">Status: ${booking.status}</div>
            </div>
          </div>

          <div class="receipt-table">
            <div class="receipt-row">
              <span>Vehicle:</span>
              <span><strong>${booking.carName}</strong> (${booking.category})</span>
            </div>
            <div class="receipt-row">
              <span>Pick-up Location:</span>
              <span>${booking.pickupLocation}</span>
            </div>
            <div class="receipt-row">
              <span>Drop-off Location:</span>
              <span>${booking.returnLocation}</span>
            </div>
            <div class="receipt-row">
              <span>Rental Schedule:</span>
              <span>${booking.pickupDate} (${booking.pickupTime}) → ${booking.returnDate} (${booking.returnTime})</span>
            </div>
            <div class="receipt-row">
              <span>Duration:</span>
              <span>${booking.days} Days</span>
            </div>
            <div class="receipt-row">
              <span>Customer Name:</span>
              <span>${booking.customerName}</span>
            </div>
            <div class="receipt-row">
              <span>Contact / Phone:</span>
              <span>${booking.customerPhone}</span>
            </div>
            <div class="receipt-row">
              <span>Driving License:</span>
              <span>${booking.licenseNumber}</span>
            </div>
            <div class="receipt-row" style="border-top: 1px dashed var(--border-subtle); padding-top: 0.5rem; margin-top: 0.5rem;">
              <span>Daily Rate:</span>
              <span>${formatINR(booking.dailyRate)}/day</span>
            </div>
            <div class="receipt-row">
              <span>Taxes (18% GST):</span>
              <span>${formatINR(booking.taxes)}</span>
            </div>
            <div class="receipt-row">
              <span>Security Deposit (Refundable):</span>
              <span>${formatINR(booking.securityDeposit)}</span>
            </div>
            <div class="receipt-row" style="font-size: 1.15rem; font-weight: 800; color: var(--navy-dark); border-top: 1.5px solid var(--navy-dark); padding-top: 0.75rem;">
              <span>Total Amount Paid:</span>
              <span style="color: var(--orange-accent);">${formatINR(booking.totalPrice)}</span>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-navy" onclick="printReceipt()"><i data-lucide="download"></i> Download Booking Receipt</button>
          <button class="btn btn-primary" onclick="navigateTo('dashboard')"><i data-lucide="layout-dashboard"></i> Go to My Dashboard</button>
        </div>
      </div>
    `;
  }
  lucide.createIcons();
}

function updateWizardDates(pDate, rDate) {
  if (pDate) appState.bookingForm.pickupDate = pDate;
  if (rDate) appState.bookingForm.returnDate = rDate;
  renderBookingStep(appState.currentBookingStep);
}

function processConfirmBooking() {
  const car = appState.selectedCarForBooking || CARS_DATABASE[0];
  const days = calculateRentalDays(appState.bookingForm.pickupDate, appState.bookingForm.returnDate);
  const baseRate = car.pricePerDay * days;
  const taxes = Math.round(baseRate * 0.18);
  const total = baseRate + taxes;
  const bookingId = "C19-" + Math.floor(10000 + Math.random() * 90000);

  const newBooking = {
    bookingId,
    carId: car.id,
    carName: car.name,
    category: car.category,
    image: car.heroImage,
    pickupLocation: appState.bookingForm.pickupLocation,
    returnLocation: appState.bookingForm.returnLocation,
    pickupDate: appState.bookingForm.pickupDate,
    returnDate: appState.bookingForm.returnDate,
    pickupTime: document.getElementById("wizard-pickup-time")?.value || "10:00 AM",
    returnTime: document.getElementById("wizard-return-time")?.value || "10:00 AM",
    days,
    dailyRate: car.pricePerDay,
    securityDeposit: car.securityDeposit,
    taxes,
    totalPrice: total,
    status: "Confirmed",
    customerName: appState.bookingForm.customerName || appState.user.name,
    customerEmail: appState.bookingForm.customerEmail || appState.user.email,
    customerPhone: appState.bookingForm.customerPhone || appState.user.phone,
    licenseNumber: appState.bookingForm.licenseNumber || appState.user.license
  };

  appState.bookings.unshift(newBooking);

  // Sync to account dataset
  const acc = appState.accounts.find((a) => a.id === appState.currentAccountId);
  if (acc) {
    acc.bookings = [...appState.bookings];
  }

  appState.lastConfirmedBooking = newBooking;
  appState.currentBookingStep = 5;
  renderBookingStep(5);
  showToast(`Booking ${bookingId} successfully confirmed!`);
}

function printReceipt() {
  window.print();
}

// User Dashboard View
function renderDashboard() {
  const container = document.getElementById("dashboard-content-area");
  if (!container) return;

  const upcomingBookings = appState.bookings.filter((b) => b.status === "Confirmed");
  const previousBookings = appState.bookings.filter((b) => b.status !== "Confirmed");
  const savedVehicles = CARS_DATABASE.filter((car) => appState.favorites.includes(car.id));

  // Update dashboard user heading
  const welcomeH1 = document.querySelector(".user-welcome h1");
  const welcomeP = document.querySelector(".user-welcome p");
  if (welcomeH1) welcomeH1.textContent = `Welcome back, ${appState.user.name}!`;
  if (welcomeP) welcomeP.innerHTML = `Active Account: <strong>${appState.user.badge}</strong> (${appState.user.email}) • Manage bookings, modify dates, and view saved vehicles.`;

  container.innerHTML = `
    <!-- Upcoming Bookings Tab Content -->
    <div id="dash-upcoming-tab" class="dash-tab-pane">
      <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--navy-dark); margin-bottom: 1.25rem;">Upcoming Reservations (${upcomingBookings.length})</h2>
      ${
        upcomingBookings.length === 0
          ? `
        <div style="text-align: center; padding: 3rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
          <i data-lucide="calendar-x" style="width: 44px; height: 44px; color: var(--text-light); margin-bottom: 0.75rem;"></i>
          <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--navy-dark);">No upcoming bookings for this account</h3>
          <p style="color: var(--text-muted); margin-bottom: 1.25rem;">Ready to plan your next journey? Browse our collection of premium cars.</p>
          <button class="btn btn-primary" onclick="navigateTo('cars')">Browse Cars</button>
        </div>
      `
          : upcomingBookings.map((b) => `
        <div class="booking-item-card">
          <div class="booking-item-img">
            <img src="${b.image}" alt="${b.carName}" />
          </div>
          <div class="booking-item-details">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.35rem;">
              <span class="badge badge-success">${b.status}</span>
              <span style="font-size: 0.85rem; font-family: monospace; font-weight: 700; color: var(--navy-dark);">${b.bookingId}</span>
            </div>
            <h3>${b.carName}</h3>
            <div class="booking-meta-line">
              <span><i data-lucide="calendar"></i> ${b.pickupDate} to ${b.returnDate} (${b.days} days)</span>
              <span><i data-lucide="map-pin"></i> ${b.pickupLocation.split("-")[0]}</span>
            </div>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--navy-dark);">
              Total: <span style="color: var(--orange-accent);">${formatINR(b.totalPrice)}</span>
            </div>
          </div>
          <div class="booking-item-actions">
            <button class="btn btn-outline btn-sm" onclick="viewBookingDetails('${b.bookingId}')"><i data-lucide="eye"></i> View Booking</button>
            <button class="btn btn-outline btn-sm" onclick="modifyBookingDates('${b.bookingId}')"><i data-lucide="edit-3"></i> Modify Dates</button>
            <button class="btn btn-outline btn-sm" style="color: var(--danger); border-color: rgba(239, 68, 68, 0.3);" onclick="cancelBooking('${b.bookingId}')">
              <i data-lucide="x-circle"></i> Cancel Booking
            </button>
          </div>
        </div>
      `).join("")
      }
    </div>

    <!-- Previous Bookings -->
    <div id="dash-previous-tab" class="dash-tab-pane" style="margin-top: 3rem;">
      <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--navy-dark); margin-bottom: 1.25rem;">Previous & Completed Bookings (${previousBookings.length})</h2>
      ${
        previousBookings.length === 0
          ? `<p style="color: var(--text-muted);">No past bookings yet under this account.</p>`
          : previousBookings.map((b) => `
        <div class="booking-item-card" style="opacity: 0.9;">
          <div class="booking-item-img">
            <img src="${b.image}" alt="${b.carName}" />
          </div>
          <div class="booking-item-details">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.35rem;">
              <span class="badge ${b.status === "Cancelled" ? "badge-orange" : "badge-navy"}">${b.status}</span>
              <span style="font-size: 0.85rem; font-family: monospace; font-weight: 700; color: var(--navy-dark);">${b.bookingId}</span>
            </div>
            <h3>${b.carName}</h3>
            <div class="booking-meta-line">
              <span>${b.pickupDate} to ${b.returnDate}</span>
              <span>${b.pickupLocation.split("-")[0]}</span>
            </div>
            <div style="font-weight: 700; color: var(--navy-dark);">
              Total Paid: ${formatINR(b.totalPrice)}
            </div>
          </div>
          <div class="booking-item-actions">
            <button class="btn btn-outline btn-sm" onclick="startBookingForCar('${b.carId}')"><i data-lucide="repeat"></i> Book Again</button>
          </div>
        </div>
      `).join("")
      }
    </div>

    <!-- Saved Cars -->
    <div id="dash-saved-tab" class="dash-tab-pane" style="margin-top: 3rem;">
      <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--navy-dark); margin-bottom: 1.25rem;">Saved Cars (${savedVehicles.length})</h2>
      ${
        savedVehicles.length === 0
          ? `<p style="color: var(--text-muted);">You have not saved any cars yet.</p>`
          : `<div class="cars-grid">${savedVehicles.map((car) => createCarCardHTML(car)).join("")}</div>`
      }
    </div>
  `;
  lucide.createIcons();
}

function cancelBooking(bookingId) {
  if (confirm(`Are you sure you wish to cancel reservation #${bookingId}? Free refund will be credited.`)) {
    const booking = appState.bookings.find((b) => b.bookingId === bookingId);
    if (booking) {
      booking.status = "Cancelled";
      const acc = appState.accounts.find((a) => a.id === appState.currentAccountId);
      if (acc) acc.bookings = [...appState.bookings];
      showToast(`Reservation #${bookingId} has been cancelled.`);
      renderDashboard();
    }
  }
}

function modifyBookingDates(bookingId) {
  const newDate = prompt("Enter new return date (YYYY-MM-DD):", "2026-09-29");
  if (newDate) {
    const booking = appState.bookings.find((b) => b.bookingId === bookingId);
    if (booking) {
      booking.returnDate = newDate;
      const days = calculateRentalDays(booking.pickupDate, newDate);
      booking.days = days;
      const base = booking.dailyRate * days;
      booking.taxes = Math.round(base * 0.18);
      booking.totalPrice = base + booking.taxes;
      const acc = appState.accounts.find((a) => a.id === appState.currentAccountId);
      if (acc) acc.bookings = [...appState.bookings];
      showToast(`Reservation #${bookingId} schedule updated to ${newDate}`);
      renderDashboard();
    }
  }
}

function viewBookingDetails(bookingId) {
  const b = appState.bookings.find((x) => x.bookingId === bookingId);
  if (!b) return;
  alert(`Booking Details:\nID: ${b.bookingId}\nCar: ${b.carName}\nDates: ${b.pickupDate} to ${b.returnDate}\nLocation: ${b.pickupLocation}\nCustomer: ${b.customerName}\nAccount: ${appState.user.badge}\nTotal Amount: ${formatINR(b.totalPrice)}\nStatus: ${b.status}`);
}

// FAQ Accordion Handler
function toggleFaq(index) {
  const item = document.getElementById(`faq-item-${index}`);
  if (!item) return;
  const isActive = item.classList.contains("active");

  document.querySelectorAll(".faq-item").forEach((el) => {
    el.classList.remove("active");
    const panel = el.querySelector(".faq-answer-panel");
    if (panel) panel.style.maxHeight = null;
  });

  if (!isActive) {
    item.classList.add("active");
    const panel = item.querySelector(".faq-answer-panel");
    if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
  }
}

// Render FAQs in FAQ container
function renderFaqs() {
  const container = document.getElementById("faq-accordion-container");
  if (!container) return;

  container.innerHTML = FAQS.map((faq, idx) => `
    <div class="faq-item" id="faq-item-${idx}">
      <button class="faq-question-btn" onclick="toggleFaq(${idx})">
        <span>${faq.q}</span>
        <i data-lucide="chevron-down" class="faq-icon-arrow"></i>
      </button>
      <div class="faq-answer-panel">
        <p>${faq.a}</p>
      </div>
    </div>
  `).join("");
}

// Render Testimonials
function renderTestimonials() {
  const container = document.getElementById("testimonials-container");
  if (!container) return;

  container.innerHTML = TESTIMONIALS.map((t) => `
    <div class="testimonial-card">
      <div class="testimonial-rating">
        ${Array.from({ length: t.rating }).map(() => `<i data-lucide="star" style="fill: #f59e0b; width: 16px; height: 16px;"></i>`).join("")}
      </div>
      <p class="testimonial-text">"${t.text}"</p>
      <div class="testimonial-author">
        <img src="${t.avatar}" alt="${t.name}" class="author-avatar" />
        <div>
          <div class="author-name">${t.name}</div>
          <div class="author-role">${t.role}</div>
        </div>
      </div>
    </div>
  `).join("");
}

// Toast notification helper
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <i data-lucide="${type === "warning" ? "alert-circle" : "check-circle-2"}" style="color: var(--orange-accent); width: 20px; height: 20px;"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Mobile Nav Toggle
function toggleMobileNav() {
  const nav = document.getElementById("mobile-nav-drawer");
  if (nav) nav.classList.toggle("open");
}

function closeMobileNav() {
  const nav = document.getElementById("mobile-nav-drawer");
  if (nav) nav.classList.remove("open");
}

// Contact form submission
function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("contact-name")?.value;
  showToast(`Thank you, ${name}! Your message has been received. Our team will contact you within 2 hours.`);
  document.getElementById("contact-form")?.reset();
}

// Hero Search Card Form Submission
function handleHeroSearch(e) {
  e.preventDefault();
  const loc = document.getElementById("hero-loc")?.value;
  const pDate = document.getElementById("hero-pickup-date")?.value;
  const rDate = document.getElementById("hero-return-date")?.value;
  const cat = document.getElementById("hero-category")?.value;

  if (loc) appState.bookingForm.pickupLocation = loc;
  if (pDate) appState.bookingForm.pickupDate = pDate;
  if (rDate) appState.bookingForm.returnDate = rDate;

  navigateTo("cars");
  const catFilter = document.getElementById("fleet-category-filter");
  if (catFilter && cat) {
    catFilter.value = cat;
    applyFleetFilters();
  }
  showToast(`Showing available cars for ${loc.split("-")[0]}`);
}

// Authentication Modal Simulation
function openAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (modal) modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (modal) modal.classList.remove("open");
  document.body.style.overflow = "";
}

function updateUserStatusUI() {
  const container = document.getElementById("account-switcher-area");
  if (!container) return;

  const currentAcc = appState.user;

  container.innerHTML = `
    <div style="position: relative;">
      <div class="account-badge-indicator" onclick="toggleAccountDropdown()" title="Switch Account">
        <img src="${currentAcc.avatar}" alt="${currentAcc.name}" class="account-avatar-mini" />
        <span class="account-name-short">${currentAcc.name.split(" ")[0]}</span>
        <i data-lucide="chevron-down" style="width: 14px; height: 14px; color: var(--text-muted);"></i>
      </div>

      <!-- Account Switcher Dropdown Menu -->
      <div id="account-dropdown" class="account-switch-dropdown">
        <div class="account-dropdown-header">Switch User Account</div>
        ${appState.accounts.map((acc) => `
          <div class="account-switch-item ${acc.id === appState.currentAccountId ? "active" : ""}" onclick="switchAccount('${acc.id}')">
            <img src="${acc.avatar}" alt="${acc.name}" class="account-item-avatar" />
            <div class="account-item-info">
              <div class="account-item-name">${acc.name}</div>
              <div class="account-item-role">${acc.role}</div>
            </div>
            <span class="account-item-badge">${acc.badge}</span>
          </div>
        `).join("")}

        <div style="border-top: 1px solid var(--border-subtle); margin-top: 0.6rem; padding-top: 0.6rem; display: flex; justify-content: space-between; align-items: center;">
          <button class="btn btn-outline btn-sm" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;" onclick="closeAccountDropdown(); openAuthModal();">
            <i data-lucide="user-plus"></i> Add Account
          </button>
          <button class="btn btn-outline btn-sm" style="font-size: 0.75rem; padding: 0.35rem 0.6rem;" onclick="closeAccountDropdown(); navigateTo('dashboard');">
            <i data-lucide="layout-dashboard"></i> Dashboard
          </button>
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

// Close account dropdown when clicking outside
document.addEventListener("click", (e) => {
  const switcher = document.getElementById("account-switcher-area");
  if (switcher && !switcher.contains(e.target)) {
    closeAccountDropdown();
  }
});

// DOM Content Loaded Handler
document.addEventListener("DOMContentLoaded", () => {
  initDates();

  // Populate Location Dropdowns
  const locSelects = [document.getElementById("hero-loc")];
  locSelects.forEach((sel) => {
    if (sel) {
      sel.innerHTML = LOCATIONS.map((loc) => `<option value="${loc}">${loc}</option>`).join("");
    }
  });

  // Set default dates in inputs
  const pDateInput = document.getElementById("hero-pickup-date");
  const rDateInput = document.getElementById("hero-return-date");
  if (pDateInput) pDateInput.value = appState.bookingForm.pickupDate;
  if (rDateInput) rDateInput.value = appState.bookingForm.returnDate;

  // Price range slider display listener
  const priceSlider = document.getElementById("fleet-price-range");
  const priceDisplay = document.getElementById("price-range-val");
  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener("input", (e) => {
      priceDisplay.textContent = formatINR(e.target.value);
      applyFleetFilters();
    });
  }

  // Render static components
  renderPopularCars();
  renderFaqs();
  renderTestimonials();
  updateUserStatusUI();

  // Sticky header shadow listener
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".site-header");
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  });

  // Handle URL hash on load
  const hash = window.location.hash.replace("#", "") || "home";
  navigateTo(hash);
  lucide.createIcons();
});
