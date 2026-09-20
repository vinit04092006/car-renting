// Cars19 Fleet and Booking Data with Authentic Vehicle Photography
const CARS_DATABASE = [
  {
    id: "bmw-3-series",
    name: "BMW 3 Series",
    category: "Luxury Sedan",
    brand: "BMW",
    pricePerDay: 5999,
    securityDeposit: 15000,
    rating: 4.9,
    reviewCount: 128,
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    mileage: "16.1 km/l",
    luggage: "480 Liters (3 Bags)",
    airConditioning: "Dual-Zone Automatic Climate Control",
    featured: true,
    isPopular: true,
    tag: "Most Popular",
    heroImage: "images/bmw_3_series.jpg",
    gallery: [
      "images/bmw_3_series.jpg",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Experience dynamic driving dynamics paired with ultimate luxury. The BMW 3 Series Gran Limousine offers class-leading legroom, high-end Harman Kardon acoustics, intelligent cruise control, and sport-tuned agility for highway tours and executive commutes."
  },
  {
    id: "mercedes-c-class",
    name: "Mercedes-Benz C-Class",
    category: "Premium Sedan",
    brand: "Mercedes-Benz",
    pricePerDay: 6999,
    securityDeposit: 18000,
    rating: 4.95,
    reviewCount: 94,
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    mileage: "16.9 km/l",
    luggage: "455 Liters (3 Bags)",
    airConditioning: "Thermotronic Multi-zone A/C",
    featured: true,
    isPopular: true,
    tag: "Executive Choice",
    heroImage: "images/mercedes_c_class.jpg",
    gallery: [
      "images/mercedes_c_class.jpg",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "The Mercedes-Benz C-Class redefines automotive luxury with a vertical MBUX touchscreen, 64-color ambient lighting, plush Nappa leather appointments, and a whisper-quiet cabin engineered for effortless long-distance travel."
  },
  {
    id: "toyota-fortuner",
    name: "Toyota Fortuner",
    category: "SUV",
    brand: "Toyota",
    pricePerDay: 4999,
    securityDeposit: 12000,
    rating: 4.85,
    reviewCount: 215,
    transmission: "Automatic",
    fuelType: "Diesel",
    seats: 7,
    mileage: "14.2 km/l",
    luggage: "296 Liters (expands to 700L)",
    airConditioning: "Tri-zone Auto Climate with Rear Vents",
    featured: true,
    isPopular: true,
    tag: "Adventure Ready",
    heroImage: "images/toyota_fortuner_1.jpg",
    gallery: [
      "images/toyota_fortuner_1.jpg",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Unmatched road presence meets bulletproof reliability. The Toyota Fortuner 4x4 delivers strong torque, superior ground clearance, and spacious 7-seater comfort, making it the supreme choice for family holidays and rugged mountain expeditions."
  },
  {
    id: "hyundai-creta",
    name: "Hyundai Creta",
    category: "SUV",
    brand: "Hyundai",
    pricePerDay: 2999,
    securityDeposit: 8000,
    rating: 4.8,
    reviewCount: 180,
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    mileage: "17.0 km/l",
    luggage: "433 Liters (2 Large Bags)",
    airConditioning: "Automatic Climate with Air Purifier",
    featured: true,
    isPopular: true,
    tag: "Best Seller",
    heroImage: "images/hyundai_creta_1.jpg",
    gallery: [
      "images/hyundai_creta_1.jpg",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "India's favorite midsize SUV. The Hyundai Creta features a panoramic sunroof, ventilated front seats, Bose sound system, and refined automatic transmission, ensuring a tranquil and smooth urban or highway voyage."
  },
  {
    id: "tata-nexon",
    name: "Tata Nexon",
    category: "Compact SUV",
    brand: "Tata",
    pricePerDay: 2199,
    securityDeposit: 6000,
    rating: 4.75,
    reviewCount: 162,
    transmission: "Manual",
    fuelType: "Petrol",
    seats: 5,
    mileage: "17.4 km/l",
    luggage: "382 Liters (2 Bags)",
    airConditioning: "Fully Automatic with Rear Blowers",
    featured: true,
    isPopular: true,
    tag: "5-Star Safety",
    heroImage: "images/tata_nexon.jpg",
    gallery: [
      "images/tata_nexon.jpg",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Award-winning 5-star GNCAP safety coupled with bold futuristic styling. The Tata Nexon combines punchy turbocharged engine performance with rugged suspension tuned comfortably for any road condition."
  },
  {
    id: "kia-seltos",
    name: "Kia Seltos",
    category: "SUV",
    brand: "Kia",
    pricePerDay: 2799,
    securityDeposit: 7500,
    rating: 4.82,
    reviewCount: 140,
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    mileage: "16.5 km/l",
    luggage: "433 Liters (2 Large Bags)",
    airConditioning: "Smart Pure Air with Dual Zone A/C",
    featured: true,
    isPopular: true,
    tag: "High Tech",
    heroImage: "images/kia_seltos_1.jpg",
    gallery: [
      "images/kia_seltos_1.jpg",
      "https://images.unsplash.com/photo-1567818735868-e71b99932e29?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Sophisticated styling and modern connected cockpit. The Kia Seltos delivers a responsive dual-clutch transmission, dual panoramic digital displays, Level 2 ADAS active safety, and unmatched road composure."
  },
  {
    id: "audi-a6",
    name: "Audi A6 Matrix",
    category: "Luxury Sedan",
    brand: "Audi",
    pricePerDay: 7499,
    securityDeposit: 20000,
    rating: 4.92,
    reviewCount: 76,
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    mileage: "14.1 km/l",
    luggage: "530 Liters (3 Large Bags)",
    airConditioning: "4-Zone Deluxe Climate Control",
    featured: false,
    isPopular: false,
    tag: "Ultra Luxury",
    heroImage: "images/audi_a6_2.jpg",
    gallery: [
      "images/audi_a6_2.jpg",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "The epitome of progressive executive mobility. Featuring Matrix LED headlamps, Bang & Olufsen 3D surround audio, acoustic dual-pane glazing, and Quattro permanent all-wheel drive for effortless road travel."
  },
  {
    id: "mahindra-thar",
    name: "Mahindra Thar 4x4",
    category: "SUV",
    brand: "Mahindra",
    pricePerDay: 3499,
    securityDeposit: 9000,
    rating: 4.88,
    reviewCount: 310,
    transmission: "Automatic",
    fuelType: "Diesel",
    seats: 4,
    mileage: "13.5 km/l",
    luggage: "Hardtop Cargo (2 Bags)",
    airConditioning: "High-output HVAC with Dust Filter",
    featured: false,
    isPopular: true,
    tag: "Iconic Off-Roader",
    heroImage: "images/mahindra_thar.jpg",
    gallery: [
      "images/mahindra_thar.jpg",
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "An iconic legend rebuilt for modern exploration. Convertible hardtop, real mechanical 4WD with low-range transfer case, touchscreen infotainment, and rugged go-anywhere capability for weekend getaways."
  },
  {
    id: "maruti-baleno",
    name: "Maruti Suzuki Baleno",
    category: "Compact Hatchback",
    brand: "Maruti Suzuki",
    pricePerDay: 1699,
    securityDeposit: 4000,
    rating: 4.7,
    reviewCount: 420,
    transmission: "Manual",
    fuelType: "Petrol",
    seats: 5,
    mileage: "22.3 km/l",
    luggage: "318 Liters (2 Bags)",
    airConditioning: "Auto Climate Control",
    featured: false,
    isPopular: false,
    tag: "Fuel Saver",
    heroImage: "images/maruti_baleno.jpg",
    gallery: [
      "images/maruti_baleno.jpg",
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Ultra-economical and spacious premium hatchback. Equipped with a heads-up display, 360-degree camera, segment-best fuel economy of 22+ km/l, and zippy maneuverability in dense city traffic."
  }
];

// Seeded Accounts for Instant Multiple Account Switching & Support
const INITIAL_ACCOUNTS = [
  {
    id: "acc-rahul",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    role: "Individual Driver",
    badge: "Personal",
    phone: "+91 98765 43210",
    license: "DL-1420180092144",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    favorites: ["bmw-3-series", "toyota-fortuner"],
    bookings: [
      {
        bookingId: "C19-89241",
        carId: "bmw-3-series",
        carName: "BMW 3 Series",
        category: "Luxury Sedan",
        image: "images/bmw_3_series.jpg",
        pickupLocation: "New Delhi - IGI International Airport (DEL)",
        returnLocation: "New Delhi - IGI International Airport (DEL)",
        pickupDate: "2026-09-24",
        returnDate: "2026-09-27",
        pickupTime: "10:00 AM",
        returnTime: "06:00 PM",
        days: 3,
        dailyRate: 5999,
        securityDeposit: 15000,
        taxes: 3239,
        totalPrice: 21236,
        status: "Confirmed",
        customerName: "Rahul Sharma",
        customerEmail: "rahul.sharma@example.com",
        customerPhone: "+91 98765 43210",
        licenseNumber: "DL-1420180092144"
      },
      {
        bookingId: "C19-74319",
        carId: "toyota-fortuner",
        carName: "Toyota Fortuner",
        category: "SUV",
        image: "images/toyota_fortuner_1.jpg",
        pickupLocation: "Bengaluru - Kempegowda International Airport (BLR)",
        returnLocation: "Bengaluru - Kempegowda International Airport (BLR)",
        pickupDate: "2026-08-12",
        returnDate: "2026-08-16",
        pickupTime: "09:00 AM",
        returnTime: "08:00 PM",
        days: 4,
        dailyRate: 4999,
        securityDeposit: 12000,
        taxes: 3599,
        totalPrice: 23595,
        status: "Completed",
        customerName: "Rahul Sharma",
        customerEmail: "rahul.sharma@example.com",
        customerPhone: "+91 98765 43210",
        licenseNumber: "DL-1420180092144"
      }
    ]
  },
  {
    id: "acc-priya",
    name: "Priya Sundaram",
    email: "priya.sundaram@apextech.in",
    role: "Corporate Travel Manager",
    badge: "Business Corporate",
    phone: "+91 98112 34567",
    license: "MH-0220200055412",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    favorites: ["mercedes-c-class", "audi-a6"],
    bookings: [
      {
        bookingId: "C19-61092",
        carId: "mercedes-c-class",
        carName: "Mercedes-Benz C-Class",
        category: "Premium Sedan",
        image: "images/mercedes_c_class.jpg",
        pickupLocation: "Mumbai - Chhatrapati Shivaji Maharaj Airport (BOM)",
        returnLocation: "Mumbai - Chhatrapati Shivaji Maharaj Airport (BOM)",
        pickupDate: "2026-09-28",
        returnDate: "2026-10-02",
        pickupTime: "11:00 AM",
        returnTime: "05:00 PM",
        days: 4,
        dailyRate: 6999,
        securityDeposit: 18000,
        taxes: 5039,
        totalPrice: 33035,
        status: "Confirmed",
        customerName: "Priya Sundaram",
        customerEmail: "priya.sundaram@apextech.in",
        customerPhone: "+91 98112 34567",
        licenseNumber: "MH-0220200055412"
      }
    ]
  },
  {
    id: "acc-arjun",
    name: "Arjun Verma",
    email: "arjun.verma@wanderlust.com",
    role: "Traveler & Creator",
    badge: "Explorer Pro",
    phone: "+91 97234 56789",
    license: "KA-0520210087611",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    favorites: ["mahindra-thar", "kia-seltos"],
    bookings: [
      {
        bookingId: "C19-55104",
        carId: "mahindra-thar",
        carName: "Mahindra Thar 4x4",
        category: "SUV",
        image: "images/mahindra_thar.jpg",
        pickupLocation: "Goa - Dabolim & MOPA International Airport",
        returnLocation: "Goa - Dabolim & MOPA International Airport",
        pickupDate: "2026-10-05",
        returnDate: "2026-10-10",
        pickupTime: "08:00 AM",
        returnTime: "04:00 PM",
        days: 5,
        dailyRate: 3499,
        securityDeposit: 9000,
        taxes: 3149,
        totalPrice: 20644,
        status: "Confirmed",
        customerName: "Arjun Verma",
        customerEmail: "arjun.verma@wanderlust.com",
        customerPhone: "+91 97234 56789",
        licenseNumber: "KA-0520210087611"
      }
    ]
  }
];

const LOCATIONS = [
  "New Delhi - IGI International Airport (DEL)",
  "Mumbai - Chhatrapati Shivaji Maharaj Airport (BOM)",
  "Bengaluru - Kempegowda International Airport (BLR)",
  "Hyderabad - Rajiv Gandhi International Airport (HYD)",
  "Goa - Dabolim & MOPA International Airport",
  "Pune - Koregaon Park & Viman Nagar Hub",
  "Chennai - Central Tech Hub & Airport",
  "Jaipur - City Center & Sanganer Hub"
];

const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    role: "Senior Product Director",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "Booking was incredibly easy and the car was exactly as shown. The BMW 3 Series was spotless and handed over in under 5 minutes at Delhi airport. The entire process was smooth from pickup to return."
  },
  {
    name: "Ananya Deshmukh",
    role: "Architect & Travel Writer",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "Cars19 is unmatched in transparency. No surprise surcharges or hidden clean-up fees. The Toyota Fortuner handled our Western Ghats drive with effortless power. Outstanding customer care!"
  },
  {
    name: "Vikram Malhotra",
    role: "Tech Entrepreneur",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "I rented the Mercedes C-Class for an investor roadshow in Bengaluru. Pristine condition, instant online paperwork, and the deposit refund was processed automatically the next morning. Highly recommended."
  },
  {
    name: "Pooja Hegde",
    role: "Marketing Strategist",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "The digital booking experience is buttery smooth. Being able to compare transparent rates and get instant confirmation directly on my phone made our family holiday to Goa completely hassle-free."
  }
];

const FAQS = [
  {
    q: "How do I rent a car from Cars19?",
    a: "Renting is simple: Select your pickup location, choose your rental dates, pick your desired vehicle from our fleet, complete the quick 2-minute identity verification with your driving license, and secure your booking with our transparent pricing."
  },
  {
    q: "What documents do I need?",
    a: "You only need a valid original Government-issued Driving License (minimum 1 year holding experience) and a valid Govt photo ID (Aadhaar, Passport, or Voter ID). International travelers can present a valid International Driving Permit (IDP) and passport."
  },
  {
    q: "Is a security deposit required?",
    a: "Yes, a refundable security deposit is held during the rental duration to cover incidental tolls or extensions. The exact deposit amount (₹4,000 – ₹20,000 depending on car segment) is clearly displayed before booking and refunded back within 24–48 hours after vehicle return inspection."
  },
  {
    q: "Can I cancel my booking?",
    a: "Yes. We offer 100% free cancellation up to 6 hours before your scheduled pick-up time with zero deduction. Cancellations made within 6 hours are subject to a nominal one-day rental fee."
  },
  {
    q: "Can I extend my rental period?",
    a: "Yes, subject to vehicle availability. You can easily extend your rental directly through your Cars19 Dashboard or by contacting our 24/7 Concierge Support at least 4 hours before your scheduled drop-off."
  },
  {
    q: "Are the cars insured?",
    a: "All Cars19 vehicles are covered with comprehensive bumper-to-bumper commercial insurance. In any unforeseen incident, customer financial liability is capped at the security deposit amount under standard terms."
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major Credit Cards (Visa, Mastercard, Amex), Debit Cards, UPI (Google Pay, PhonePe, Paytm), Net Banking across 40+ Indian banks, and corporate invoicing."
  }
];
