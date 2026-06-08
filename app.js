const hotel = {
  name: "HOTEL PARK VARAHI",
  location: "Tirupati, Andhra Pradesh",
  rating: 4.7
};

const state = {
  page: "home",
  coupon: "",
  cart: [],
  wishlist: [],
  bookings: [],
  payments: [],
  rooms: [
    {
      id: 101,
      type: "Pilgrim Standard Room",
      location: "Tirupati",
      price: 1900,
      rating: 4.4,
      available: true,
      description: "Simple, clean room for short darshan visits and budget stays."
    },
    {
      id: 102,
      type: "Deluxe Double Room",
      location: "Tirupati",
      price: 2800,
      rating: 4.6,
      available: true,
      description: "AC double room suited for couples and small families."
    },
    {
      id: 103,
      type: "Family Suite near Alipiri",
      location: "Near Alipiri",
      price: 4200,
      rating: 4.8,
      available: true,
      description: "Spacious family suite with extra bedding and quick route access."
    },
    {
      id: 104,
      type: "Premium Mountain View Room",
      location: "Tirupati",
      price: 5200,
      rating: 4.7,
      available: false,
      description: "Premium room inspired by Tirumala hill views, currently reserved."
    }
  ]
};

const byId = id => document.getElementById(id);
const money = value => `INR ${Math.round(value).toLocaleString("en-IN")}`;

function toast(message) {
  const element = byId("toast");
  element.textContent = message;
  element.classList.add("show");
  setTimeout(() => element.classList.remove("show"), 2200);
}

function setPage(page) {
  state.page = page;
  document.querySelectorAll(".page").forEach(section => {
    section.classList.toggle("active", section.id === page);
  });
  document.querySelectorAll("[data-page]").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page && button.tagName === "BUTTON");
  });
  window.location.hash = page;
}

function initDates() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  byId("checkIn").valueAsDate = today;
  byId("checkOut").valueAsDate = tomorrow;
}

function nights() {
  const start = new Date(byId("checkIn").value);
  const end = new Date(byId("checkOut").value);
  const duration = Math.ceil((end - start) / 86400000);
  return Number.isFinite(duration) && duration > 0 ? duration : 1;
}

function filteredRooms() {
  const query = byId("searchInput").value.trim().toLowerCase();
  const price = byId("priceFilter").value;

  return state.rooms.filter(room => {
    const text = `${hotel.name} ${room.type} ${room.location} ${room.description}`.toLowerCase();
    const matchesText = !query || text.includes(query);
    const matchesPrice =
      price === "all" ||
      (price === "budget" && room.price < 2500) ||
      (price === "comfort" && room.price >= 2500 && room.price <= 4500) ||
      (price === "premium" && room.price > 4500);
    return matchesText && matchesPrice;
  });
}

function renderRooms() {
  byId("roomGrid").innerHTML = filteredRooms().map(room => `
    <article class="room-card">
      <div class="room-photo"><strong>${room.location}</strong></div>
      <div class="room-body">
        <h3>${room.type}</h3>
        <p class="rating">Rating ${room.rating} / 5</p>
        <p>${room.description}</p>
        <p class="price">${money(room.price)} / night</p>
        <p class="muted">${room.available ? "Available today" : "Unavailable"}</p>
        <div class="actions">
          <button ${room.available ? "" : "disabled"} onclick="addToCart(${room.id})">Add to Cart</button>
          <button class="ghost" onclick="toggleWishlist(${room.id})">${state.wishlist.includes(room.id) ? "Saved" : "Wishlist"}</button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(roomId) {
  if (!state.cart.includes(roomId)) {
    state.cart.push(roomId);
    toast("Room added to cart");
  }
  renderAll();
}

function toggleWishlist(roomId) {
  state.wishlist = state.wishlist.includes(roomId)
    ? state.wishlist.filter(id => id !== roomId)
    : [...state.wishlist, roomId];
  renderAll();
}

function removeFromCart(roomId) {
  state.cart = state.cart.filter(id => id !== roomId);
  renderAll();
}

function cartSubtotal() {
  return state.cart
    .map(id => state.rooms.find(room => room.id === id))
    .filter(Boolean)
    .reduce((sum, room) => sum + room.price * nights(), 0);
}

function cartTotal() {
  const subtotal = cartSubtotal();
  return state.coupon === "VARAHI10" ? subtotal * 0.9 : subtotal;
}

function renderCart() {
  byId("cartCount").textContent = state.cart.length;
  byId("wishlistCount").textContent = state.wishlist.length;
  byId("cartTotal").textContent = money(cartTotal());

  byId("cartList").innerHTML = state.cart.length
    ? state.cart.map(id => {
      const room = state.rooms.find(item => item.id === id);
      return `
        <div class="line-item">
          <span><strong>${room.type}</strong><br><small>${nights()} night stay</small></span>
          <span>${money(room.price * nights())}</span>
          <button class="danger" onclick="removeFromCart(${room.id})">Remove</button>
        </div>
      `;
    }).join("")
    : "<p class='muted'>Cart is empty.</p>";
}

function checkout() {
  if (!state.cart.length) {
    toast("Add at least one room before payment");
    return;
  }

  const checkIn = byId("checkIn").value;
  const checkOut = byId("checkOut").value;
  const method = byId("paymentMethod").value;

  state.cart.forEach(roomId => {
    const room = state.rooms.find(item => item.id === roomId);
    const amount = state.coupon === "VARAHI10" ? room.price * nights() * 0.9 : room.price * nights();
    const booking = {
      id: 1000 + state.bookings.length + 1,
      hotel: hotel.name,
      room: room.type,
      checkIn,
      checkOut,
      amount,
      status: "CONFIRMED"
    };
    state.bookings.push(booking);
    state.payments.push({
      id: 5000 + state.payments.length + 1,
      bookingId: booking.id,
      method,
      amount,
      status: "SUCCESS"
    });
  });

  state.cart = [];
  toast("Payment successful. Booking confirmed.");
  renderAll();
}

function renderBookings() {
  byId("bookingHistory").innerHTML = state.bookings.length
    ? state.bookings.map(booking => `
      <div class="line-item">
        <span><strong>#${booking.id}</strong><br><small>${booking.room}<br>${booking.checkIn} to ${booking.checkOut}</small></span>
        <span>${money(booking.amount)}</span>
      </div>
    `).join("")
    : "<p class='muted'>No bookings yet.</p>";
}

function renderDashboard() {
  byId("metricRooms").textContent = state.rooms.length;
  byId("metricBookings").textContent = state.bookings.length;
  byId("metricRevenue").textContent = money(state.payments.reduce((sum, payment) => sum + payment.amount, 0));

  byId("bookingReport").innerHTML = `
    <div class="table-row header"><span>ID</span><span>Room</span><span>Amount</span><span>Status</span></div>
    ${state.bookings.length ? state.bookings.map(booking => `
      <div class="table-row"><span>#${booking.id}</span><span>${booking.room}</span><span>${money(booking.amount)}</span><span>${booking.status}</span></div>
    `).join("") : "<p class='muted'>No booking records.</p>"}
  `;
}

function saveRoom(event) {
  event.preventDefault();
  state.rooms.push({
    id: Date.now(),
    type: byId("roomType").value,
    location: "Tirupati",
    price: Number(byId("price").value),
    rating: hotel.rating,
    available: byId("availability").value === "true",
    description: "Manager-added room for HOTEL PARK VARAHI."
  });
  event.target.reset();
  toast("Room added to HOTEL PARK VARAHI");
  renderAll();
}

function downloadReport() {
  const rows = [
    ["booking_id", "hotel", "room", "check_in", "check_out", "amount", "status"],
    ...state.bookings.map(booking => [booking.id, booking.hotel, booking.room, booking.checkIn, booking.checkOut, booking.amount, booking.status])
  ];
  const csv = rows.map(row => row.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "hotel-park-varahi-booking-report.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function renderAll() {
  renderRooms();
  renderCart();
  renderBookings();
  renderDashboard();
}

document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", event => {
    event.preventDefault();
    setPage(button.dataset.page);
  });
});

["searchInput", "checkIn", "checkOut", "priceFilter"].forEach(id => {
  byId(id).addEventListener("input", renderAll);
});

byId("applyCoupon").addEventListener("click", () => {
  state.coupon = byId("couponInput").value.trim().toUpperCase();
  toast(state.coupon === "VARAHI10" ? "Coupon applied: 10% off" : "Invalid coupon");
  renderAll();
});

byId("payNow").addEventListener("click", checkout);
byId("roomForm").addEventListener("submit", saveRoom);
byId("downloadReport").addEventListener("click", downloadReport);

initDates();
setPage(location.hash.replace("#", "") || "home");
renderAll();
