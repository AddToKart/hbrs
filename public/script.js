const API_BASE = "http://localhost:3000/api";

// Global variables
let rooms = [];
let bookings = [];

// DOM elements
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.querySelector(".close");

// Initialize app
document.addEventListener("DOMContentLoaded", function () {
  loadRooms();
  loadBookings();
  setupEventListeners();
});

// Event listeners
function setupEventListeners() {
  document
    .getElementById("booking-form")
    .addEventListener("submit", handleBookingSubmit);
  document
    .getElementById("add-room-form")
    .addEventListener("submit", handleAddRoomSubmit);
  closeModal.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
}

// Navigation
function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });

  // Remove active class from nav buttons
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Show selected section
  document.getElementById(sectionName).classList.add("active");
  event.target.classList.add("active");

  // Load data for specific sections
  if (sectionName === "booking") {
    loadRoomsForBooking();
  } else if (sectionName === "bookings") {
    loadBookings();
  } else if (sectionName === "system-status") {
    loadSystemStatus();
  }
}

// API calls
async function loadRooms() {
  try {
    const response = await fetch(`${API_BASE}/rooms`);
    rooms = await response.json();
    displayRooms();
  } catch (error) {
    console.error("Error loading rooms:", error);
    showNotification("Error loading rooms", "error");
  }
}

async function loadBookings() {
  try {
    const response = await fetch(`${API_BASE}/bookings`);
    bookings = await response.json();
    displayBookings();
  } catch (error) {
    console.error("Error loading bookings:", error);
    showNotification("Error loading bookings", "error");
  }
}

async function loadRoomsForBooking() {
  const roomSelect = document.querySelector('select[name="room_id"]');
  roomSelect.innerHTML = '<option value="">Select Room</option>';

  rooms.forEach((room) => {
    const option = document.createElement("option");
    option.value = room.id;
    option.textContent = `Room ${room.room_number} - ${room.room_type} - $${room.price_per_night}/night`;
    roomSelect.appendChild(option);
  });
}

// Display functions
function displayRooms() {
  const roomsGrid = document.getElementById("rooms-grid");
  roomsGrid.innerHTML = "";

  rooms.forEach((room) => {
    const roomCard = document.createElement("div");
    roomCard.className = "room-card";
    roomCard.innerHTML = `
            <h3>Room ${room.room_number}</h3>
            <p><strong>Type:</strong> ${capitalizeFirst(room.room_type)}</p>
            <p><strong>Capacity:</strong> ${room.capacity} ${
      room.capacity === 1 ? "person" : "people"
    }</p>
            <p><strong>Amenities:</strong> ${room.amenities}</p>
            <p class="price">$${room.price_per_night}/night</p>
        `;
    roomsGrid.appendChild(roomCard);
  });
}

function displayBookings() {
  const bookingsList = document.getElementById("bookings-list");
  bookingsList.innerHTML = "";

  if (bookings.length === 0) {
    bookingsList.innerHTML =
      '<p style="text-align: center; color: #666;">No bookings found.</p>';
    return;
  }

  bookings.forEach((booking) => {
    const bookingCard = document.createElement("div");
    bookingCard.className = "booking-card";
    bookingCard.innerHTML = `
            <h4>Booking #${booking.id}</h4>
            <div class="booking-details">
                <div class="detail-item">
                    <div class="detail-label">Guest Name</div>
                    <div class="detail-value">${booking.first_name} ${
      booking.last_name
    }</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Email</div>
                    <div class="detail-value">${booking.email}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Room</div>
                    <div class="detail-value">Room ${
                      booking.room_number
                    } (${capitalizeFirst(booking.room_type)})</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Check-in</div>
                    <div class="detail-value">${formatDate(
                      booking.check_in_date
                    )}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Check-out</div>
                    <div class="detail-value">${formatDate(
                      booking.check_out_date
                    )}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Total Amount</div>
                    <div class="detail-value">$${booking.total_amount}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Status</div>
                    <div class="detail-value">${capitalizeFirst(
                      booking.booking_status
                    )}</div>
                </div>
            </div>
            ${
              booking.special_requests
                ? `<p><strong>Special Requests:</strong> ${booking.special_requests}</p>`
                : ""
            }
        `;
    bookingsList.appendChild(bookingCard);
  });
}

// Form handling
async function handleBookingSubmit(e) {
  e.preventDefault();

  try {
    // Get customer data
    const customerForm = document.getElementById("customer-form");
    const customerData = new FormData(customerForm);
    const customer = Object.fromEntries(customerData.entries());

    // Create customer
    const customerResponse = await fetch(`${API_BASE}/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    });

    const customerResult = await customerResponse.json();

    if (!customerResponse.ok) {
      throw new Error(customerResult.error || "Failed to create customer");
    }

    // Get booking data
    const bookingForm = document.getElementById("booking-form");
    const bookingData = new FormData(bookingForm);
    const booking = Object.fromEntries(bookingData.entries());
    booking.customer_id = customerResult.id;

    // Create booking
    const bookingResponse = await fetch(`${API_BASE}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });

    const bookingResult = await bookingResponse.json();

    if (!bookingResponse.ok) {
      throw new Error(bookingResult.error || "Failed to create booking");
    }

    // Show success message
    showModal(`
            <h3 style="color: #28a745;">Booking Successful!</h3>
            <p><strong>Booking ID:</strong> ${bookingResult.id}</p>
            <p><strong>Total Amount:</strong> $${bookingResult.total_amount}</p>
            <p>Your reservation has been confirmed.</p>
        `);

    // Reset forms
    customerForm.reset();
    bookingForm.reset();

    // Refresh data
    loadRooms();
    loadBookings();
  } catch (error) {
    console.error("Booking error:", error);
    showNotification(error.message, "error");
  }
}

async function handleAddRoomSubmit(e) {
  e.preventDefault();

  try {
    const formData = new FormData(e.target);
    const roomData = Object.fromEntries(formData.entries());

    // Convert numeric fields
    roomData.price_per_night = parseFloat(roomData.price_per_night);
    roomData.capacity = parseInt(roomData.capacity);

    const response = await fetch(`${API_BASE}/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roomData),
    });

    // Check if response is ok before parsing JSON
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    // Show success message
    showModal(`
      <h3 style="color: #28a745;">Room Added Successfully!</h3>
      <p><strong>Room Number:</strong> ${roomData.room_number}</p>
      <p><strong>Type:</strong> ${capitalizeFirst(roomData.room_type)}</p>
      <p><strong>Price:</strong> $${roomData.price_per_night}/night</p>
      <p>The room is now available for booking.</p>
    `);

    // Reset form
    e.target.reset();

    // Refresh rooms data
    loadRooms();
  } catch (error) {
    console.error("Add room error:", error);
    showNotification(error.message, "error");
  }
}

// System Status Functions
async function loadSystemStatus() {
  await checkApiStatus();
  await checkDatabaseStatus();
  await loadSystemStats();
  await loadTablesInfo();
}

async function checkApiStatus() {
  const indicator = document.getElementById("api-indicator");
  const details = document.getElementById("api-details");

  try {
    const response = await fetch(`${API_BASE}/health`);
    const result = await response.json();

    if (response.ok) {
      indicator.textContent = "Online";
      indicator.className = "status-indicator status-ok";
      details.textContent = `${result.message} - ${result.timestamp}`;
    } else {
      throw new Error("API not responding properly");
    }
  } catch (error) {
    indicator.textContent = "Offline";
    indicator.className = "status-indicator status-error";
    details.textContent = `Error: ${error.message}`;
  }
}

async function checkDatabaseStatus() {
  const indicator = document.getElementById("db-indicator");
  const details = document.getElementById("db-details");

  try {
    const response = await fetch(`${API_BASE}/database/status`);
    const result = await response.json();

    if (response.ok && result.status === "OK") {
      indicator.textContent = "Connected";
      indicator.className = "status-indicator status-ok";
      details.textContent = `${result.message} - Host: ${result.connection.host}`;
    } else {
      throw new Error(result.message || "Database connection failed");
    }
  } catch (error) {
    indicator.textContent = "Disconnected";
    indicator.className = "status-indicator status-error";
    details.textContent = `Error: ${error.message}`;
  }
}

async function loadSystemStats() {
  const statsGrid = document.getElementById("stats-grid");

  try {
    const response = await fetch(`${API_BASE}/stats`);
    const result = await response.json();

    if (response.ok) {
      const stats = result.statistics;
      statsGrid.innerHTML = `
        <div class="stat-item">
          <div class="stat-number">${stats.totalRooms}</div>
          <div class="stat-label">Total Rooms</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${stats.availableRooms}</div>
          <div class="stat-label">Available Rooms</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${stats.totalCustomers}</div>
          <div class="stat-label">Total Customers</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${stats.totalBookings}</div>
          <div class="stat-label">Total Bookings</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${stats.pendingBookings}</div>
          <div class="stat-label">Pending Bookings</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${stats.confirmedBookings}</div>
          <div class="stat-label">Confirmed Bookings</div>
        </div>
      `;
    } else {
      throw new Error("Failed to load statistics");
    }
  } catch (error) {
    statsGrid.innerHTML = `<p style="color: #e74c3c;">Error loading statistics: ${error.message}</p>`;
  }
}

async function loadTablesInfo() {
  const tablesInfo = document.getElementById("tables-info");

  try {
    const response = await fetch(`${API_BASE}/database/tables`);
    const result = await response.json();

    if (response.ok) {
      tablesInfo.innerHTML = result.tables
        .map(
          (table) => `
        <div class="table-item">
          <span class="table-name">${table.TABLE_NAME}</span>
          <span class="table-rows">${table.TABLE_ROWS} rows</span>
        </div>
      `
        )
        .join("");
    } else {
      throw new Error("Failed to load table information");
    }
  } catch (error) {
    tablesInfo.innerHTML = `<p style="color: #e74c3c;">Error loading table information: ${error.message}</p>`;
  }
}

function refreshSystemStatus() {
  loadSystemStatus();
  showNotification("System status refreshed", "info");
}

// Utility functions
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

function showModal(content) {
  modalBody.innerHTML = content;
  modal.style.display = "block";
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "error" ? "#e74c3c" : "#28a745"};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 1001;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}
