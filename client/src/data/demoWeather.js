// SAMPLE weather used in demo mode. NOT real data.
// Later, the backend will call OpenWeather and return real current conditions and forecasts.
// condition: "sunny" | "partly" | "cloudy" | "rain"

export const DEMO_WEATHER = [
  {
    place: "Mumbai", lat: 19.076, lng: 72.8777,
    current: { tempC: 31, condition: "partly", humidity: 70, windKmh: 14 },
    forecast: [
      { minC: 26, maxC: 32, rainChance: 20, condition: "partly" },
      { minC: 26, maxC: 31, rainChance: 30, condition: "cloudy" },
      { minC: 25, maxC: 31, rainChance: 40, condition: "rain" },
    ],
  },
  {
    place: "Lonavala", lat: 18.7557, lng: 73.4091,
    current: { tempC: 26, condition: "cloudy", humidity: 78, windKmh: 12 },
    forecast: [
      { minC: 21, maxC: 28, rainChance: 40, condition: "cloudy" },
      { minC: 21, maxC: 27, rainChance: 50, condition: "rain" },
      { minC: 20, maxC: 27, rainChance: 40, condition: "cloudy" },
    ],
  },
  {
    place: "Kolhapur", lat: 16.705, lng: 74.2433,
    current: { tempC: 30, condition: "sunny", humidity: 55, windKmh: 10 },
    forecast: [
      { minC: 22, maxC: 32, rainChance: 10, condition: "sunny" },
      { minC: 22, maxC: 31, rainChance: 20, condition: "partly" },
      { minC: 22, maxC: 31, rainChance: 25, condition: "partly" },
    ],
  },
  {
    place: "Panaji", lat: 15.4909, lng: 73.8278,
    current: { tempC: 32, condition: "partly", humidity: 74, windKmh: 16 },
    forecast: [
      { minC: 25, maxC: 33, rainChance: 15, condition: "partly" },
      { minC: 25, maxC: 32, rainChance: 30, condition: "cloudy" },
      { minC: 25, maxC: 32, rainChance: 30, condition: "cloudy" },
    ],
  },
];
