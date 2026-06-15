const fs = require('fs');

const hotels = [
  { id: "udaipur-1", name: "Trident Udaipur" },
  { id: "udaipur-4", name: "Wyndham Grand Udaipur Fatehsagar Lake" },
  { id: "udaipur-5", name: "Aurika, Udaipur - Luxury by Lemon Tree Hotels" },
  { id: "udaipur-6", name: "SWAROOP VILAS - LAKE FACING BOUTIQUE HOTEL" },
  { id: "udaipur-7", name: "Hotel Udai Kothi" },
  { id: "udaipur-8", name: "Hilltop Palace - Best Located Lake Facing Hotel In Udaipur" },
  { id: "udaipur-9", name: "Moustache Select Udaipur" },
  { id: "udaipur-10", name: "Tripli Hotels Shaurya Residency" },
  { id: "udaipur-11", name: "Radisson Blu Udaipur Palace Resort and Spa" },
  { id: "udaipur-12", name: "Shalom Backpackers Udaipur | Rooms & Dorms" },
  { id: "udaipur-13", name: "Raffles Udaipur" },
  { id: "udaipur-14", name: "Jaisamand Island Resort" },
  { id: "udaipur-15", name: "Hotel City Express by Downtown" },
  { id: "udaipur-16", name: "The Lalit Laxmi vilas palace" },
  { id: "udaipur-17", name: "Taj Fateh Prakash Palace, Udaipur" },
  { id: "udaipur-18", name: "The Oberoi Udaivilas" },
  { id: "udaipur-19", name: "Mementos by ITC Hotels Ekaaya Udaipur" },
  { id: "udaipur-21", name: "The Leela Palace Udaipur" },
  { id: "udaipur-22", name: "Taj Lake Palace, Udaipur" },
  { id: "udaipur-23", name: "The Shikargarh Palace" },
  { id: "udaipur-24", name: "Badigarh Resort Udaipur" },
  { id: "udaipur-25", name: "Cottage Rivera by VEO - Part of StayVista" },
  { id: "udaipur-26", name: "Sukh Durga Niwas" },
  { id: "udaipur-27", name: "FOOTRA STAY & CAFE" },
  { id: "udaipur-28", name: "The Fern Residency Udaipur, Series by Marriott" },
  { id: "udaipur-29", name: "HOTEL ANGAN" },
  { id: "udaipur-30", name: "Tree of Life Vantara Resort and Spa Udaipur" },
  { id: "udaipur-31", name: "Tree of Life Amara Resort & Spa, Udaipur" },
  { id: "udaipur-32", name: "Chunda Haveli - A Boutique Hotel in Udaipur" },
  { id: "udaipur-33", name: "Ramada Encore By Wyndham Udaipur Roopnagar" },
  { id: "udaipur-34", name: "Namoka The Fort Resort | Suites with Private Pool & Jacuzzi" }
];

async function geocode() {
  const results = {};
  for (let i = 0; i < hotels.length; i++) {
    const hotel = hotels[i];
    let queryName = hotel.name.split('-')[0].split('|')[0].trim();
    if (!queryName.toLowerCase().includes('udaipur')) queryName += ' Udaipur';
    
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryName)}&format=json&limit=1`, {
        headers: { 'User-Agent': 'YatraverseApp/1.0' }
      });
      const data = await res.json();
      if (data && data.length > 0) {
        results[hotel.id] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        console.log(`Found ${hotel.id} (${queryName}):`, results[hotel.id]);
      } else {
        // Provide a random fallback around central Udaipur
        const fallbackLat = 24.5854 + (Math.random() - 0.5) * 0.05;
        const fallbackLon = 73.6811 + (Math.random() - 0.5) * 0.05;
        results[hotel.id] = [parseFloat(fallbackLat.toFixed(4)), parseFloat(fallbackLon.toFixed(4))];
        console.log(`Not found ${hotel.id} (${queryName}), using fallback:`, results[hotel.id]);
      }
    } catch(e) {
      console.error(e);
      const fallbackLat = 24.5854 + (Math.random() - 0.5) * 0.05;
      const fallbackLon = 73.6811 + (Math.random() - 0.5) * 0.05;
      results[hotel.id] = [parseFloat(fallbackLat.toFixed(4)), parseFloat(fallbackLon.toFixed(4))];
    }
    // rate limit OpenStreetMap Nominatim: 1 req/sec
    await new Promise(r => setTimeout(r, 1000));
  }
  
  fs.writeFileSync('coords.json', JSON.stringify(results, null, 2));
}

geocode();
