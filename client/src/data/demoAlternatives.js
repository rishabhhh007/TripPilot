// SAMPLE alternatives used by Replace / Add in demo mode.
// Later, the backend will fetch real alternatives from a Places API and return the same shape.
// Names, coordinates and costs are approximate sample values and are NOT verified.

function alt(id, category, name, description, address, lat, lng, estimatedCost, durationMinutes, tags = []) {
  return { id, category, name, description, address, lat, lng, estimatedCost, durationMinutes, tags };
}

export const ALTERNATIVES = [
  // Breakfast
  alt("a-b1", "breakfast", "Bakery cafe, Lonavala", "Light breakfast with tea and baked snacks.", "Lonavala, Maharashtra (approximate)", 18.752, 73.405, 450, 40, ["vegetarian"]),
  alt("a-b2", "breakfast", "Highway dhaba, near Khopoli", "Quick parathas and chai just off the expressway.", "Khopoli, Maharashtra (approximate)", 18.789, 73.345, 400, 30),
  alt("a-b3", "breakfast", "Idli and dosa house, Kolhapur", "South Indian breakfast close to the city centre.", "Kolhapur, Maharashtra (approximate)", 16.708, 74.24, 350, 35, ["vegetarian"]),
  alt("a-b4", "breakfast", "Cafe near Rankala, Kolhapur", "Relaxed breakfast near the lake.", "Kolhapur, Maharashtra (approximate)", 16.69, 74.215, 650, 45),

  // Lunch
  alt("a-l1", "lunch", "Vegetarian thali restaurant, Satara", "Simple vegetarian thali, good for a quick break.", "Satara, Maharashtra (approximate)", 17.69, 74.0, 700, 50, ["vegetarian"]),
  alt("a-l2", "lunch", "Family restaurant, Karad", "Regional meals and quick service.", "Karad, Maharashtra (approximate)", 17.285, 74.185, 800, 55),
  alt("a-l3", "lunch", "Ghat view restaurant, Amboli", "Meals with a view over the valley.", "Amboli, Maharashtra (approximate)", 15.96, 74.005, 1100, 60),
  alt("a-l4", "lunch", "Budget meals hotel, Kolhapur", "Affordable local meals.", "Kolhapur, Maharashtra (approximate)", 16.7, 74.23, 600, 45, ["vegetarian"]),

  // Dinner
  alt("a-d1", "dinner", "Vegetarian restaurant, Kolhapur", "Comfortable vegetarian dinner near the main road.", "Kolhapur, Maharashtra (approximate)", 16.71, 74.245, 800, 60, ["vegetarian"]),
  alt("a-d2", "dinner", "Fine dining, Kolhapur", "A more upscale meal after a long drive.", "Kolhapur, Maharashtra (approximate)", 16.702, 74.238, 1600, 80),
  alt("a-d3", "dinner", "Beachside shack, Miramar", "Casual seafood dinner near the beach.", "Miramar, Goa (approximate)", 15.482, 73.808, 1300, 80),
  alt("a-d4", "dinner", "Vegetarian restaurant, Panaji", "Vegetarian dinner in the city centre.", "Panaji, Goa (approximate)", 15.497, 73.83, 900, 60, ["vegetarian"]),

  // Hotels
  alt("a-h1", "hotel", "Budget lodge, Kolhapur", "Basic, clean rooms close to the bus stand.", "Kolhapur, Maharashtra (approximate)", 16.7, 74.24, 2200, 720),
  alt("a-h2", "hotel", "Business hotel, Kolhapur", "Comfortable rooms with breakfast options.", "Kolhapur, Maharashtra (approximate)", 16.71, 74.25, 3000, 720),
  alt("a-h3", "hotel", "Premium hotel, Kolhapur", "Higher-end stay with more facilities.", "Kolhapur, Maharashtra (approximate)", 16.715, 74.235, 5200, 720),
  alt("a-h4", "hotel", "Budget guesthouse, Panaji", "Simple guesthouse in the old quarter.", "Panaji, Goa (approximate)", 15.495, 73.83, 2800, 720),
  alt("a-h5", "hotel", "Riverside hotel, Panaji", "Comfortable stay with river views.", "Panaji, Goa (approximate)", 15.5, 73.825, 4800, 720),

  // Attractions
  alt("a-a1", "attraction", "Karla Caves", "Well-preserved rock-cut caves near Lonavala.", "Near Lonavala, Maharashtra (approximate)", 18.783, 73.47, 200, 90),
  alt("a-a2", "attraction", "Lohagad Fort viewpoint", "Short hike to a hill fort with wide views.", "Near Lonavala, Maharashtra (approximate)", 18.711, 73.476, 150, 150),
  alt("a-a3", "attraction", "Rankala Lake, Kolhapur", "Evening stroll by the lake.", "Kolhapur, Maharashtra (approximate)", 16.69, 74.215, 0, 60),
  alt("a-a4", "attraction", "New Palace Museum, Kolhapur", "Royal palace with a small museum.", "Kolhapur, Maharashtra (approximate)", 16.708, 74.216, 100, 75),
  alt("a-a5", "attraction", "Dona Paula viewpoint", "Sea-facing viewpoint near Panaji.", "Dona Paula, Goa (approximate)", 15.453, 73.801, 0, 60),
  alt("a-a6", "attraction", "Fort Aguada", "Seventeenth-century fort overlooking the sea.", "Candolim, Goa (approximate)", 15.492, 73.773, 50, 75),

  // Fuel and rest
  alt("a-f1", "fuel", "Fuel station, Satara bypass", "Refuel point on the highway.", "Satara, Maharashtra (approximate)", 17.7, 74.01, 0, 15),
  alt("a-f2", "fuel", "Fuel station, Kolhapur entry", "Refuel before entering the city.", "Kolhapur, Maharashtra (approximate)", 16.75, 74.25, 0, 15),
  alt("a-r1", "rest", "Highway food court, near Khandala", "Washrooms, snacks and parking.", "Khandala, Maharashtra (approximate)", 18.76, 73.38, 150, 20),
  alt("a-r2", "rest", "Rest area, near Karad", "Short stop to stretch your legs.", "Karad, Maharashtra (approximate)", 17.3, 74.17, 100, 20),
];
