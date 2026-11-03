// Cars19 Frontend API Client
// Connects UI smoothly to the Node.js / Express backend with offline fallback support

const API_BASE = window.location.protocol.startsWith("http") ? "/api" : null;

const API = {
  // Check if backend API is reachable
  isOnline: Boolean(API_BASE),

  // Generic Request Helper
  async request(endpoint, options = {}) {
    if (!API_BASE) {
      console.warn("Running in local file mode (file://). Using static memory data.");
      return null;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        },
        ...options
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      return data;
    } catch (err) {
      console.warn(`API call to ${endpoint} failed, falling back to local state:`, err.message);
      return null;
    }
  },

  // 1. Cars APIs
  async getCars(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `/cars${query ? `?${query}` : ""}`;
    const res = await this.request(url);
    return res ? res.data : null;
  },

  async getCarById(id) {
    const res = await this.request(`/cars/${encodeURIComponent(id)}`);
    return res ? res.data : null;
  },

  // 2. Bookings APIs
  async getBookings(email = null) {
    const query = email ? `?email=${encodeURIComponent(email)}` : "";
    const res = await this.request(`/bookings${query}`);
    return res ? res.data : null;
  },

  async createBooking(bookingData) {
    const res = await this.request("/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData)
    });
    return res ? res.data : null;
  },

  async cancelBooking(bookingId) {
    const res = await this.request(`/bookings/${encodeURIComponent(bookingId)}/cancel`, {
      method: "PATCH"
    });
    return res ? res.data : null;
  },

  // 3. Accounts & Auth APIs
  async getAccounts() {
    const res = await this.request("/auth/accounts");
    return res ? res.data : null;
  },

  async registerAccount(accountData) {
    const res = await this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(accountData)
    });
    return res ? res.data : null;
  },

  // 4. Contact Inquiries
  async submitContact(contactData) {
    const res = await this.request("/contact", {
      method: "POST",
      body: JSON.stringify(contactData)
    });
    return res ? res.data : null;
  },

  // 5. Metadata
  async getLocations() {
    const res = await this.request("/locations");
    return res ? res.data : null;
  },

  async getTestimonials() {
    const res = await this.request("/testimonials");
    return res ? res.data : null;
  },

  async getFaqs() {
    const res = await this.request("/faqs");
    return res ? res.data : null;
  }
};
