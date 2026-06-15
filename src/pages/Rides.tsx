import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  User, 
  Tag,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Banknote,
  MapPin,
  Calendar,
  Hourglass,
  Menu,
  Clock,
  X,
  UserPlus,
  CircleDot
} from 'lucide-react';
import './Rides.css';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CITY_COORDS: Record<string, [number, number]> = {
  "Delhi": [28.6139, 77.2090],
  "Udaipur": [24.5854, 73.7125],
  "Mumbai": [19.0760, 72.8777],
  "Bangalore": [12.9716, 77.5946],
  "Hyderabad": [17.3850, 78.4867],
  "Chennai": [13.0827, 80.2707],
  "Kolkata": [22.5726, 88.3639],
  "Jaipur": [26.9124, 75.7873],
  "Agra": [27.1767, 78.0081],
  "Varanasi": [25.3176, 82.9739],
  "Sikkim": [27.3314, 88.6138],
  "Rishikesh": [30.0869, 78.2676],
  "Goa": [15.4909, 73.8278],
  "Leh, Ladakh": [34.1526, 77.5771],
  "Munnar": [10.0892, 77.0595],
  "Amritsar": [31.6340, 74.8723]
};

interface LocationSuggestion {
  display_name: string;
  lat: number;
  lon: number;
}

const TOP_LOCATIONS: Record<string, LocationSuggestion[]> = {
  "Delhi": [
    { display_name: "Indira Gandhi International Airport, Delhi", lat: 28.5562, lon: 77.1000 },
    { display_name: "New Delhi Railway Station, Delhi", lat: 28.6429, lon: 77.2191 },
    { display_name: "Connaught Place, Delhi", lat: 28.6304, lon: 77.2177 },
    { display_name: "India Gate, Delhi", lat: 28.6129, lon: 77.2295 }
  ],
  "Mumbai": [
    { display_name: "Chhatrapati Shivaji Maharaj International Airport", lat: 19.0896, lon: 72.8656 },
    { display_name: "Gateway of India, Mumbai", lat: 18.9220, lon: 72.8347 },
    { display_name: "Bandra Kurla Complex, Mumbai", lat: 19.0660, lon: 72.8650 }
  ],
  "Udaipur": [
    { display_name: "Maharana Pratap Airport, Udaipur", lat: 24.6177, lon: 73.8962 },
    { display_name: "City Palace, Udaipur", lat: 24.5764, lon: 73.6835 },
    { display_name: "Lake Pichola, Udaipur", lat: 24.5702, lon: 73.6749 }
  ],
  "Munnar": [
    { display_name: "Munnar Bus Stand, Kerala", lat: 10.0889, lon: 77.0595 },
    { display_name: "Eravikulam National Park, Munnar", lat: 10.2197, lon: 77.0583 }
  ],
  "Amritsar": [
    { display_name: "Sri Guru Ram Dass Jee International Airport", lat: 31.7096, lon: 74.7973 },
    { display_name: "Golden Temple, Amritsar", lat: 31.6200, lon: 74.8765 },
    { display_name: "Jallianwala Bagh, Amritsar", lat: 31.6208, lon: 74.8800 }
  ]
};

const DEFAULT_CENTER: [number, number] = [28.6139, 77.2090];

const VEHICLES = [
  { id: 'bikego', name: 'BikeGo', capacity: 1, perKmRate: 4, baseFare: 15, time: '1 min away', desc: 'Fastest bike ride', img: '/vehicles/bikego.png', deal: 'Cheapest' },
  { id: 'autogo', name: 'AutoGo', capacity: 3, perKmRate: 8, baseFare: 30, time: '2 min away', desc: 'Auto Rickshaw', img: '/vehicles/autogo.png', deal: 'Low Price' },
  { id: 'swiftgo', name: 'SwiftGo', capacity: 4, perKmRate: 12, baseFare: 50, time: '3 min away', desc: 'Budget', img: '/vehicles/hatchback.png', deal: 'Most Popular' },
  { id: 'comfortgo', name: 'ComfortGo', capacity: 4, perKmRate: 15, baseFare: 60, time: '4 min away', desc: 'Regular AC rides', img: '/vehicles/sedan.png', deal: null },
  { id: 'primego', name: 'PrimeGo', capacity: 4, perKmRate: 18, baseFare: 70, time: '2 min away', desc: 'Premium', img: '/vehicles/sedan.png', deal: null },
  { id: 'royalgo', name: 'RoyalGo', capacity: 4, perKmRate: 40, baseFare: 150, time: '6 min away', desc: 'Ultra Luxury', img: '/vehicles/suv.png', deal: null },
  { id: 'familygo', name: 'FamilyGo', capacity: 6, perKmRate: 22, baseFare: 100, time: '5 min away', desc: '6-7 Seater', img: '/vehicles/suv.png', deal: null },
  { id: 'expressgo', name: 'ExpressGo', capacity: 4, perKmRate: 20, baseFare: 80, time: '1 min away', desc: 'Fast pickup', img: '/vehicles/expressgo.png', deal: 'Fastest' },
  { id: 'savergo', name: 'SaverGo', capacity: 4, perKmRate: 10, baseFare: 40, time: '12 min away', desc: 'Wait & Save', img: '/vehicles/savergo.png', deal: null },
  { id: 'petgo', name: 'PetGo', capacity: 4, perKmRate: 16, baseFare: 65, time: '8 min away', desc: 'Pet-friendly', img: '/vehicles/petgo.png', deal: null },
  { id: 'cargogo', name: 'CargoGo', capacity: 2, perKmRate: 18, baseFare: 80, time: '15 min away', desc: 'Parcel delivery', img: '/vehicles/van.png', deal: null }
];

const MapUpdater = ({ pickupCoord, dropoffCoord, mapCenter }: { pickupCoord: [number, number] | null, dropoffCoord: [number, number] | null, mapCenter: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (pickupCoord && dropoffCoord) {
      const bounds = L.latLngBounds([pickupCoord, dropoffCoord]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else if (pickupCoord) {
      map.flyTo(pickupCoord, 14, { duration: 1 });
    } else if (dropoffCoord) {
      map.flyTo(dropoffCoord, 14, { duration: 1 });
    } else {
      map.flyTo(mapCenter, 12, { duration: 1 });
    }
  }, [pickupCoord, dropoffCoord, mapCenter, map]);
  return null;
};

interface NearbyCab {
  id: number;
  lat: number;
  lon: number;
  targetLat: number;
  targetLon: number;
  img: string;
  headingRight: boolean;
}

const createCabIcon = (imgUrl: string, headingRight: boolean) => {
  return L.divIcon({
    html: `<img src="${imgUrl}" style="width: 50px; height: 35px; transform: ${headingRight ? 'scaleX(-1)' : 'none'}; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));" />`,
    className: 'nearby-cab-icon',
    iconSize: [50, 35],
    iconAnchor: [25, 17]
  });
};

const createCustomPin = (color: string) => L.divIcon({
  html: `<div style="
    background-color: ${color};
    width: 32px;
    height: 32px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 3px solid white;
    box-shadow: 2px 2px 6px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
  ">
    <span style="
      color: white; 
      font-weight: 900; 
      font-size: 18px; 
      font-family: 'Inter', sans-serif; 
      transform: rotate(45deg);
      line-height: 1;
      margin-top: 2px;
      margin-right: 2px;
    ">G</span>
  </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  tooltipAnchor: [16, -16]
});

const pickupIcon = createCustomPin('#10b981'); // GoYatra Emerald Green
const dropoffIcon = createCustomPin('#ea580c'); // GoYatra Orange

const Rides: React.FC = () => {
  const [originCity, setOriginCity] = useState(localStorage.getItem('fromCity') || 'Delhi');
  const mapCenter = CITY_COORDS[originCity] || DEFAULT_CENTER;

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [actualPickupCoord, setActualPickupCoord] = useState<[number, number] | null>(null);
  const [actualDropoffCoord, setActualDropoffCoord] = useState<[number, number] | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('Today');
  const [scheduleTime, setScheduleTime] = useState('Now');

  const [isChoosingRider, setIsChoosingRider] = useState(false);
  const [riderType, setRiderType] = useState('Self');

  const [selectedVehicle, setSelectedVehicle] = useState<string>('swiftgo');
  
  type BookingState = 'selecting' | 'requesting' | 'assigned' | 'arriving' | 'arrived' | 'trip_started' | 'completed';
  const [bookingState, setBookingState] = useState<BookingState>('selecting');
  
  const [routeGeometry, setRouteGeometry] = useState<[number, number][] | null>(null);
  const [driverGeometry, setDriverGeometry] = useState<[number, number][] | null>(null);
  const [carPosition, setCarPosition] = useState<[number, number] | null>(null);

  const [isSafeTravelEnabled, setIsSafeTravelEnabled] = useState(true);
  const [showRoute, setShowRoute] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  
  const [nearbyCabs, setNearbyCabs] = useState<NearbyCab[]>([]);

  // Nearby Cabs Simulation
  useEffect(() => {
    // We only simulate when selecting to keep it clean, or we can keep it always running.
    // Let's keep it running around the mapCenter or actualPickupCoord.
    const center = actualPickupCoord || mapCenter;
    
    const generateCab = (id: number): NearbyCab => {
      const lat = center[0] + (Math.random() - 0.5) * 0.03; // ~1.5km radius
      const lon = center[1] + (Math.random() - 0.5) * 0.03;
      const targetLat = lat + (Math.random() - 0.5) * 0.01;
      const targetLon = lon + (Math.random() - 0.5) * 0.01;
      const vehicle = VEHICLES[Math.floor(Math.random() * VEHICLES.length)];
      return { id, lat, lon, targetLat, targetLon, img: vehicle.img, headingRight: targetLon > lon };
    };

    let cabs = Array.from({ length: 8 }).map((_, i) => generateCab(i));
    setNearbyCabs(cabs);

    const interval = setInterval(() => {
      cabs = cabs.map(cab => {
        const dx = cab.targetLat - cab.lat;
        const dy = cab.targetLon - cab.lon;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        // If very close to target, pick new target
        if (dist < 0.0002) {
          const newTargetLat = cab.lat + (Math.random() - 0.5) * 0.015;
          const newTargetLon = cab.lon + (Math.random() - 0.5) * 0.015;
          return { ...cab, targetLat: newTargetLat, targetLon: newTargetLon, headingRight: newTargetLon > cab.lon };
        }

        // Move smoothly
        const speed = 0.00003; // ~1.5 meters per frame at 50ms = 30m/s
        const ratio = Math.min(speed / dist, 1);
        return {
          ...cab,
          lat: cab.lat + dx * ratio,
          lon: cab.lon + dy * ratio
        };
      });
      setNearbyCabs([...cabs]);
    }, 50); // 20 FPS for smooth animation

    return () => clearInterval(interval);
  }, [mapCenter, actualPickupCoord]);
  
  const [sosState, setSosState] = useState<'idle' | 'countdown' | 'triggered'>('idle');
  const [sosCountdown, setSosCountdown] = useState(3);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (sosState === 'countdown' && sosCountdown > 0) {
      timer = setTimeout(() => setSosCountdown(sosCountdown - 1), 1000);
    } else if (sosState === 'countdown' && sosCountdown === 0) {
      setSosState('triggered');
    }
    return () => clearTimeout(timer);
  }, [sosState, sosCountdown]);

  const handleSosClick = () => {
    if (sosState === 'idle') {
      setSosState('countdown');
      setSosCountdown(3);
    } else if (sosState === 'countdown') {
      setSosState('idle');
    }
  };

  const [pickupSuggestions, setPickupSuggestions] = useState<LocationSuggestion[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<LocationSuggestion[]>([]);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropoffDropdown, setShowDropoffDropdown] = useState(false);

  const [recentLocations, setRecentLocations] = useState<LocationSuggestion[]>(() => {
    try {
      const stored = localStorage.getItem('recentRidesLocations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveRecentLocation = (s: LocationSuggestion) => {
    setRecentLocations(prev => {
      const filtered = prev.filter(loc => loc.display_name !== s.display_name);
      const newRecents = [s, ...filtered].slice(0, 5); // Keep top 5
      localStorage.setItem('recentRidesLocations', JSON.stringify(newRecents));
      return newRecents;
    });
  };

  // Geocode Pickup Search
  useEffect(() => {
    if (pickup.length < 3) {
      setPickupSuggestions([]);
      setShowPickupDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const viewbox = `${mapCenter[1]-0.2},${mapCenter[0]+0.2},${mapCenter[1]+0.2},${mapCenter[0]-0.2}`;
        const query = encodeURIComponent(pickup.includes(originCity) ? pickup : `${pickup}, ${originCity}`);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&countrycodes=in&viewbox=${viewbox}&bounded=1&format=json&limit=15`);
        const data = await res.json();
        if (data && data.length > 0) {
          const suggestions = data.map((d: any) => ({
            display_name: d.display_name,
            lat: parseFloat(d.lat),
            lon: parseFloat(d.lon)
          }));
          const uniqueSuggestions = Array.from(new Map(suggestions.map((item: any) => [item.display_name, item])).values()) as LocationSuggestion[];
          setPickupSuggestions(uniqueSuggestions);
          if (!actualPickupCoord) setShowPickupDropdown(true);
        }
      } catch (err) {}
    }, 500);
    return () => clearTimeout(timer);
  }, [pickup, originCity]);

  // Geocode Dropoff Search
  useEffect(() => {
    if (dropoff.length < 3) {
      setDropoffSuggestions([]);
      setShowDropoffDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const viewbox = `${mapCenter[1]-0.2},${mapCenter[0]+0.2},${mapCenter[1]+0.2},${mapCenter[0]-0.2}`;
        const query = encodeURIComponent(dropoff.includes(originCity) ? dropoff : `${dropoff}, ${originCity}`);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&countrycodes=in&viewbox=${viewbox}&bounded=1&format=json&limit=15`);
        const data = await res.json();
        if (data && data.length > 0) {
          const suggestions = data.map((d: any) => ({
            display_name: d.display_name,
            lat: parseFloat(d.lat),
            lon: parseFloat(d.lon)
          }));
          const uniqueSuggestions = Array.from(new Map(suggestions.map((item: any) => [item.display_name, item])).values()) as LocationSuggestion[];
          setDropoffSuggestions(uniqueSuggestions);
          if (!actualDropoffCoord) setShowDropoffDropdown(true);
        }
      } catch (err) {}
    }, 500);
    return () => clearTimeout(timer);
  }, [dropoff, originCity]);

  // Calculate Distance via OSRM
  useEffect(() => {
    if (actualPickupCoord && actualDropoffCoord) {
      setIsCalculating(true);
      setShowRoute(true);
      const fetchDistance = async () => {
        try {
          const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${actualPickupCoord[1]},${actualPickupCoord[0]};${actualDropoffCoord[1]},${actualDropoffCoord[0]}?overview=false`);
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            setDistanceKm(data.routes[0].distance / 1000);
          }
        } catch (err) {
          const dx = actualPickupCoord[0] - actualDropoffCoord[0];
          const dy = actualPickupCoord[1] - actualDropoffCoord[1];
          setDistanceKm(Math.sqrt(dx*dx + dy*dy) * 111);
        } finally {
          setIsCalculating(false);
        }
      };
      fetchDistance();
    } else {
      setDistanceKm(null);
      setShowRoute(false);
    }
  }, [actualPickupCoord, actualDropoffCoord]);

  const selectedVehicleData = VEHICLES.find(v => v.id === selectedVehicle);

  useEffect(() => {
    if (pickup.length > 3 && dropoff.length > 3) {
      setShowRoute(true);
    } else {
      setShowRoute(false);
    }
  }, [pickup, dropoff]);

  const handleRequest = async () => {
    if (!actualPickupCoord || !actualDropoffCoord) return;
    setBookingState('requesting');
    
    // Fake a mock driver starting point roughly 1-2km away
    const mockDriverLat = actualPickupCoord[0] + (Math.random() - 0.5) * 0.02;
    const mockDriverLon = actualPickupCoord[1] + (Math.random() - 0.5) * 0.02;
    setCarPosition([mockDriverLat, mockDriverLon]);

    // Fetch driver arriving route
    try {
      const res1 = await fetch(`https://router.project-osrm.org/route/v1/driving/${mockDriverLon},${mockDriverLat};${actualPickupCoord[1]},${actualPickupCoord[0]}?overview=full&geometries=geojson`);
      const data1 = await res1.json();
      if(data1.code === 'Ok') {
        const coords = data1.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]);
        setDriverGeometry(coords);
      }
      
      // Fetch actual trip route
      const res2 = await fetch(`https://router.project-osrm.org/route/v1/driving/${actualPickupCoord[1]},${actualPickupCoord[0]};${actualDropoffCoord[1]},${actualDropoffCoord[0]}?overview=full&geometries=geojson`);
      const data2 = await res2.json();
      if(data2.code === 'Ok') {
        const coords = data2.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]);
        setRouteGeometry(coords);
      }
    } catch (e) {
      console.error("OSRM Fetch Error", e);
    }

    // Simulate network delay & sequence
    setTimeout(() => {
      setBookingState('assigned');
      setTimeout(() => {
        setBookingState('arriving');
      }, 3000);
    }, 2500);
  };

  const startTrip = () => {
    setBookingState('trip_started');
  };

  const resetBooking = () => {
    setBookingState('selecting');
    setPickup('');
    setDropoff('');
    setActualPickupCoord(null);
    setActualDropoffCoord(null);
    setCarPosition(null);
    setRouteGeometry(null);
    setDriverGeometry(null);
  };

  // Animation for Driver Arriving
  useEffect(() => {
    if (bookingState !== 'arriving' || !driverGeometry || driverGeometry.length < 2) return;
    let startTime: number | null = null;
    let animationFrameId: number;

    const dists: number[] = [];
    let totalDist = 0;
    for(let i=0; i<driverGeometry.length-1; i++) {
      const dx = driverGeometry[i+1][0] - driverGeometry[i][0];
      const dy = driverGeometry[i+1][1] - driverGeometry[i][1];
      const d = Math.sqrt(dx*dx + dy*dy);
      dists.push(d);
      totalDist += d;
    }

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / 5000, 1); // 5 seconds arriving
      
      if (progress >= 1) {
        setCarPosition(driverGeometry[driverGeometry.length - 1]);
        setBookingState('arrived');
        return;
      }

      const targetDist = progress * totalDist;
      let currentDist = 0;
      for (let i = 0; i < driverGeometry.length - 1; i++) {
        if (currentDist + dists[i] >= targetDist) {
          const segmentProgress = dists[i] === 0 ? 0 : (targetDist - currentDist) / dists[i];
          const lat = driverGeometry[i][0] + (driverGeometry[i+1][0] - driverGeometry[i][0]) * segmentProgress;
          const lon = driverGeometry[i][1] + (driverGeometry[i+1][1] - driverGeometry[i][1]) * segmentProgress;
          setCarPosition([lat, lon]);
          break;
        }
        currentDist += dists[i];
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [bookingState, driverGeometry]);

  // Animation for Trip Started
  useEffect(() => {
    if (bookingState !== 'trip_started' || !routeGeometry || routeGeometry.length < 2) return;
    let startTime: number | null = null;
    let animationFrameId: number;

    const dists: number[] = [];
    let totalDist = 0;
    for(let i=0; i<routeGeometry.length-1; i++) {
      const dx = routeGeometry[i+1][0] - routeGeometry[i][0];
      const dy = routeGeometry[i+1][1] - routeGeometry[i][1];
      const d = Math.sqrt(dx*dx + dy*dy);
      dists.push(d);
      totalDist += d;
    }

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / 8000, 1); // 8 seconds trip
      
      if (progress >= 1) {
        setCarPosition(routeGeometry[routeGeometry.length - 1]);
        setBookingState('completed');
        return;
      }

      const targetDist = progress * totalDist;
      let currentDist = 0;
      for (let i = 0; i < routeGeometry.length - 1; i++) {
        if (currentDist + dists[i] >= targetDist) {
          const segmentProgress = dists[i] === 0 ? 0 : (targetDist - currentDist) / dists[i];
          const lat = routeGeometry[i][0] + (routeGeometry[i+1][0] - routeGeometry[i][0]) * segmentProgress;
          const lon = routeGeometry[i][1] + (routeGeometry[i+1][1] - routeGeometry[i][1]) * segmentProgress;
          setCarPosition([lat, lon]);
          break;
        }
        currentDist += dists[i];
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [bookingState, routeGeometry]);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setOriginCity(city);
    localStorage.setItem('fromCity', city);
    setPickup('');
    setDropoff('');
    setActualPickupCoord(null);
    setActualDropoffCoord(null);
  };

  const handleSelectPickup = (s: LocationSuggestion) => {
    if (actualDropoffCoord && actualDropoffCoord[0] === s.lat && actualDropoffCoord[1] === s.lon) {
      alert('Pickup and Dropoff locations cannot be the same.');
      return;
    }
    setPickup(s.display_name);
    setActualPickupCoord([s.lat, s.lon]);
    setShowPickupDropdown(false);
    saveRecentLocation(s);
  };

  const handleSelectDropoff = (s: LocationSuggestion) => {
    if (actualPickupCoord && actualPickupCoord[0] === s.lat && actualPickupCoord[1] === s.lon) {
      alert('Pickup and Dropoff locations cannot be the same.');
      return;
    }
    setDropoff(s.display_name);
    setActualDropoffCoord([s.lat, s.lon]);
    setShowDropoffDropdown(false);
    saveRecentLocation(s);
  };

  return (
    <div className="uber-layout" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)' }}>
      {/* Top Bar for City Selection */}
      <div style={{ padding: '1rem 2rem', background: 'linear-gradient(90deg, #000000, #1f2937)', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '1.1rem' }}>Current City Location:</span>
        <select 
          value={originCity} 
          onChange={handleCityChange}
          style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #4b5563', background: '#374151', color: '#ffffff', outline: 'none', fontWeight: 600, cursor: 'pointer' }}
        >
          {Object.keys(CITY_COORDS).map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="uber-container" style={{ height: '100%', display: 'flex', position: 'relative' }}>
        {/* Left Column - Get a ride */}
        {!isMapExpanded && (
          <div className="uber-left-column">
            <div className="get-ride-card" style={isScheduling || isChoosingRider ? { display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: '1rem' } : {}}>
              {!isScheduling && !isChoosingRider ? (
                <>
                  <h2>Book a Cab</h2>
                  
                  <div className="promo-tag">
                    <Tag size={16} color="#ea580c" />
                    25% off your next ride. Up to ₹500 <span style={{ opacity: 0.6, fontSize: '0.8rem', marginLeft: 'auto' }}>ⓘ</span>
                  </div>

              <div className="location-inputs-wrapper">
                <div className="timeline-line"></div>
                <div className="uber-input-group" style={{ position: 'relative', zIndex: 2 }}>
                  <div className="circle-icon"></div>
                  <div style={{ width: '100%' }}>
                    <input 
                      type="text" 
                      value={pickup}
                      onChange={(e) => { 
                        setPickup(e.target.value); 
                        setActualPickupCoord(null); 
                        if (e.target.value.length < 3) setShowPickupDropdown(true); // show recents
                        else setShowPickupDropdown(false); // will show after debounce
                      }}
                      onFocus={() => { 
                        if(pickup.length < 3) setShowPickupDropdown(true); 
                        else if(pickupSuggestions.length > 0 && !actualPickupCoord) setShowPickupDropdown(true); 
                        setShowDropoffDropdown(false); 
                      }}
                      placeholder="Pickup"
                      style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '1rem' }}
                    />
                  </div>
                  {showPickupDropdown && (
                    <ul className="autocomplete-dropdown">
                      {pickup.length < 3 ? (
                        <>
                          {recentLocations.length > 0 && (
                            <>
                              <div style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Recent</div>
                              {recentLocations.map((s, i) => (
                                <li key={`recent-pick-${i}`} className="suggestion-item" onClick={() => handleSelectPickup(s)}>
                                  <MapPin size={16} className="suggestion-icon" />
                                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.display_name}</span>
                                </li>
                              ))}
                            </>
                          )}
                          {TOP_LOCATIONS[originCity] && (
                            <>
                              <div style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Top Locations in {originCity}</div>
                              {TOP_LOCATIONS[originCity].map((s, i) => (
                                <li key={`top-pick-${i}`} className="suggestion-item" onClick={() => handleSelectPickup(s)}>
                                  <MapPin size={16} className="suggestion-icon" />
                                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.display_name}</span>
                                </li>
                              ))}
                            </>
                          )}
                        </>
                      ) : (
                        pickupSuggestions.map((s, i) => (
                          <li key={`sugg-pick-${i}`} className="suggestion-item" onClick={() => handleSelectPickup(s)}>
                            <MapPin size={16} className="suggestion-icon" />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.display_name}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>
                <div className="uber-input-group" style={{ position: 'relative', zIndex: 1 }}>
                  <div className="square-icon"></div>
                  <div style={{ width: '100%' }}>
                    <input 
                      type="text" 
                      value={dropoff}
                      onChange={(e) => { 
                        setDropoff(e.target.value); 
                        setActualDropoffCoord(null);
                        if (e.target.value.length < 3) setShowDropoffDropdown(true); // show recents
                        else setShowDropoffDropdown(false);
                      }}
                      onFocus={() => { 
                        if(dropoff.length < 3) setShowDropoffDropdown(true);
                        else if(dropoffSuggestions.length > 0 && !actualDropoffCoord) setShowDropoffDropdown(true); 
                        setShowPickupDropdown(false); 
                      }}
                      placeholder="Dropoff"
                      style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '1rem' }}
                    />
                  </div>
                  {showDropoffDropdown && (
                    <ul className="autocomplete-dropdown">
                      {dropoff.length < 3 ? (
                        <>
                          {recentLocations.length > 0 && (
                            <>
                              <div style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Recent</div>
                              {recentLocations.map((s, i) => (
                                <li key={`recent-drop-${i}`} className="suggestion-item" onClick={() => handleSelectDropoff(s)}>
                                  <MapPin size={16} className="suggestion-icon" />
                                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.display_name}</span>
                                </li>
                              ))}
                            </>
                          )}
                          {TOP_LOCATIONS[originCity] && (
                            <>
                              <div style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Top Locations in {originCity}</div>
                              {TOP_LOCATIONS[originCity].map((s, i) => (
                                <li key={`top-drop-${i}`} className="suggestion-item" onClick={() => handleSelectDropoff(s)}>
                                  <MapPin size={16} className="suggestion-icon" />
                                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.display_name}</span>
                                </li>
                              ))}
                            </>
                          )}
                        </>
                      ) : (
                        dropoffSuggestions.map((s, i) => (
                          <li key={`sugg-drop-${i}`} className="suggestion-item" onClick={() => handleSelectDropoff(s)}>
                            <MapPin size={16} className="suggestion-icon" />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.display_name}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>
              </div>

              <div className="dropdown-inputs">
                <div className="uber-select" onClick={() => setIsScheduling(true)} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={18} /> {scheduleDate === 'Today' && scheduleTime === 'Now' ? 'Ride Now' : `${scheduleDate}, ${scheduleTime}`}
                  </div>
                  <ChevronDown size={18} />
                </div>
                
                <div className="uber-select" onClick={() => setIsChoosingRider(true)} style={{ width: 'fit-content', padding: '0.6rem 1rem', borderRadius: '30px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={16} /> {riderType}
                  </div>
                  <ChevronDown size={16} />
                </div>
              </div>
                </>
              ) : isScheduling ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <button onClick={() => setIsScheduling(false)} style={{ border: 'none', background: '#fff7ed', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ea580c' }}>
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => { setScheduleDate('Today'); setScheduleTime('Now'); }} style={{ border: 'none', background: 'transparent', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', color: '#ea580c' }}>
                      Clear
                    </button>
                  </div>
                  
                  <h2 style={{ fontSize: '1.8rem', lineHeight: 1.1, marginBottom: '0.5rem', fontWeight: 800, color: '#0f172a' }}>When do you want to be picked up?</h2>
                  <div style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>From {pickup || originCity}</div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Calendar size={20} color="#ea580c" />
                        <span style={{ fontWeight: 600, fontSize: '1.1rem', color: '#0f172a' }}>{scheduleDate}</span>
                      </div>
                      <ChevronDown size={20} color="#ea580c" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Clock size={20} color="#ea580c" />
                        <span style={{ fontWeight: 600, fontSize: '1.1rem', color: '#0f172a' }}>{scheduleTime}</span>
                      </div>
                      <ChevronDown size={20} color="#ea580c" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1.5rem', padding: '0.5rem 0' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <Calendar size={20} color="#ea580c" style={{ marginTop: '2px' }} />
                      <div style={{ color: '#475569', fontSize: '0.95rem', fontWeight: 500 }}>Choose your pickup time up to 90 days in advance</div>
                    </div>
                    <div style={{ borderBottom: '1px solid #e2e8f0' }}></div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <Hourglass size={20} color="#ea580c" style={{ marginTop: '2px' }} />
                      <div style={{ color: '#475569', fontSize: '0.95rem', fontWeight: 500 }}>Extra wait time included to meet your ride</div>
                    </div>
                    <div style={{ borderBottom: '1px solid #e2e8f0' }}></div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <Menu size={20} color="#ea580c" style={{ marginTop: '2px' }} />
                      <div style={{ color: '#475569', fontSize: '0.95rem', fontWeight: 500 }}>Cancel at no charge up to 60 minutes in advance</div>
                    </div>
                  </div>
                  
                  <div style={{ textDecoration: 'underline', color: '#ea580c', fontSize: '0.9rem', marginBottom: 'auto', cursor: 'pointer', fontWeight: 600 }}>See terms</div>

                  <button 
                    onClick={() => setIsScheduling(false)}
                    style={{ width: '100%', padding: '1rem', background: 'linear-gradient(to right, #f97316, #ea580c)', color: 'white', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: '1rem', boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)', transition: 'all 0.2s' }}>
                    Confirm Time
                  </button>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.8rem', lineHeight: 1.1, margin: 0, fontWeight: 800, color: '#0f172a' }}>Choose a rider</h2>
                    <button onClick={() => setIsChoosingRider(false)} style={{ border: 'none', background: '#fff7ed', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ea580c' }}>
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <div onClick={() => setRiderType('Self')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: riderType === 'Self' ? '#fff7ed' : '#ffffff', border: riderType === 'Self' ? '2px solid #ea580c' : '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: '#f8fafc', padding: '0.6rem', borderRadius: '50%', border: '1px solid #e2e8f0', display: 'flex' }}>
                          <User size={24} color={riderType === 'Self' ? '#ea580c' : '#64748b'} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>Me</span>
                      </div>
                      {riderType === 'Self' && <CircleDot size={20} color="#ea580c" />}
                    </div>

                    <div onClick={() => setRiderType('Someone Else')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: riderType === 'Someone Else' ? '#fff7ed' : '#ffffff', border: riderType === 'Someone Else' ? '2px solid #ea580c' : '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: '#f8fafc', padding: '0.6rem', borderRadius: '50%', border: '1px solid #e2e8f0', display: 'flex' }}>
                          <UserPlus size={24} color={riderType === 'Someone Else' ? '#ea580c' : '#64748b'} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>Order ride for someone else</span>
                      </div>
                      {riderType === 'Someone Else' && <CircleDot size={20} color="#ea580c" />}
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsChoosingRider(false)}
                    style={{ width: '100%', padding: '1rem', background: 'linear-gradient(to right, #f97316, #ea580c)', color: 'white', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: 'auto', boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)', transition: 'all 0.2s' }}>
                    Done
                  </button>
                </>
              )}
            </div>
          </div>
      )}

      {/* Middle Column - Choose a ride OR SafeTravel Dashboard */}
      {!isMapExpanded && (bookingState !== 'selecting' || (actualPickupCoord && actualDropoffCoord)) && (
        <div className="uber-mid-column">
          {bookingState === 'selecting' ? (
            <>
              <div className="mid-header">
                <h1>Select Vehicle</h1>
                <h3>Recommended for you</h3>
              </div>
              
              <div className="vehicle-list">
                {VEHICLES.map((v) => (
                  <div 
                    key={v.id} 
                    className={`uber-vehicle-card ${selectedVehicle === v.id ? 'selected' : ''}`}
                    onClick={() => setSelectedVehicle(v.id)}
                  >
                    <div className="vehicle-card-left">
                      <img src={v.img} alt={v.name} className="vehicle-image" />
                      <div className="vehicle-details">
                        <div className="v-title-row">
                          <span className="v-name">{v.name}</span>
                          <span className="v-capacity"><User size={12} />{v.capacity}</span>
                        </div>
                        <span className="v-time">{v.time}</span>
                        {v.desc && <span className="v-desc">{v.desc}</span>}
                        {v.deal && <span className="v-deal-badge">{v.deal}</span>}
                      </div>
                    </div>
                    <div className="vehicle-price" style={{ minWidth: '80px', textAlign: 'right' }}>
                      {isCalculating || !distanceKm ? (
                        <span style={{ fontSize: '1rem', color: '#9ca3af', animation: 'pulse 1.5s infinite' }}>Calculating...</span>
                      ) : (
                        <span>₹{((distanceKm * v.perKmRate) + v.baseFare).toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="sticky-action-bar">
                <div className="payment-selector">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a' }}>
                    <Banknote size={18} /> <span style={{ color: '#000' }}>Pay in Cash</span>
                  </div>
                  <ChevronDown size={18} color="#000" />
                </div>
                <button className="request-btn" onClick={handleRequest}>
                  Book {selectedVehicleData?.name}
                </button>
              </div>
            </>
          ) : bookingState === 'requesting' ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              <div style={{ width: 50, height: 50, border: '4px solid #f3f3f3', borderTop: '4px solid #000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <h2 style={{ marginTop: '2rem' }}>Finding your ride...</h2>
              <p style={{ color: '#64748b' }}>Contacting nearby drivers</p>
            </div>
          ) : bookingState === 'completed' ? (
            <div className="uber-safetravel-overlay" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0', letterSpacing: '-0.5px' }}>
                You have arrived!
              </h1>
              <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#000', fontSize: '1.2rem' }}>Hope you had a great trip</h3>
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>₹{((distanceKm || 0) * (selectedVehicleData?.perKmRate || 0) + (selectedVehicleData?.baseFare || 0)).toFixed(2)}</div>
                <button onClick={resetBooking} className="request-btn" style={{ marginTop: '1.5rem' }}>Done</button>
              </div>
            </div>
          ) : (
            <div className="uber-safetravel-overlay" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0', letterSpacing: '-0.5px' }}>
                {bookingState === 'assigned' ? 'Driver Assigned' : bookingState === 'arriving' ? 'Driver Arriving' : bookingState === 'arrived' ? 'Driver Arrived' : 'Trip in Progress'}
              </h1>

              {/* Driver Info Card */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#000', fontSize: '1.2rem' }}>
                  {bookingState === 'assigned' ? `Your ${selectedVehicleData?.name} is on the way` : bookingState === 'arriving' ? `Your ${selectedVehicleData?.name} is arriving` : bookingState === 'arrived' ? 'Share OTP to start trip' : 'En route to destination'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>👨🏽‍✈️</div>
                  <div>
                    <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem', fontWeight: 700 }}>Ramesh K.</h4>
                    <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>4.9 ★ • DL 1Z AB 1234</p>
                  </div>
                </div>
                {bookingState !== 'trip_started' ? (
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontWeight: '800', color: '#0f172a', fontSize: '1.4rem', letterSpacing: '4px' }}>
                    OTP: 4892
                  </div>
                ) : (
                  <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontWeight: '800', color: '#166534', fontSize: '1.2rem' }}>
                    Trip Started
                  </div>
                )}
                {bookingState === 'arrived' && (
                  <button onClick={startTrip} className="request-btn" style={{ marginTop: '1rem', background: '#000', color: '#fff' }}>Start Trip</button>
                )}
              </div>

              {/* SafeTravel Toggle Card */}
              <div style={{ background: isSafeTravelEnabled ? '#dcfce7' : '#fee2e2', borderRadius: '16px', padding: '1.5rem', border: `1px solid ${isSafeTravelEnabled ? '#bbf7d0' : '#fecaca'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: isSafeTravelEnabled ? '#16a34a' : '#dc2626', color: 'white', padding: '0.6rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.3rem 0', color: isSafeTravelEnabled ? '#166534' : '#991b1b', fontSize: '1.1rem', fontWeight: 700, transition: 'color 0.3s ease' }}>SafeTravel Mode</h4>
                    <p style={{ margin: 0, color: isSafeTravelEnabled ? '#15803d' : '#b91c1c', fontSize: '0.9rem', transition: 'color 0.3s ease' }}>{isSafeTravelEnabled ? 'Enhanced security is active.' : 'Security features are disabled.'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: isSafeTravelEnabled ? '#166534' : '#991b1b', marginRight: '0.8rem', fontSize: '0.9rem', transition: 'color 0.3s ease' }}>{isSafeTravelEnabled ? 'ON' : 'OFF'}</span>
                  <label className="switch">
                    <input type="checkbox" checked={isSafeTravelEnabled} onChange={(e) => setIsSafeTravelEnabled(e.target.checked)} />
                    <span className="slider" style={{ background: isSafeTravelEnabled ? '#16a34a' : '#ccc' }}></span>
                  </label>
                </div>
              </div>

              {isSafeTravelEnabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'slideUp 0.3s ease-out' }}>
                  {/* Live Location Sharing */}
                  <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#0f172a', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={18} color="#f97316" /> Live Location Sharing
                    </h3>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                      {/* Trusted Contacts */}
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#475569' }}>Trusted Contacts</h4>
                        <div style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#bfdbfe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>M</div>
                            <div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Mom</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>+91 98765 43210</div>
                            </div>
                          </div>
                          <div style={{ color: '#ef4444', cursor: 'pointer', fontWeight: 800 }}>⊖</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#bae6fd', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>B</div>
                            <div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Brother</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>+91 98765 43211</div>
                            </div>
                          </div>
                          <div style={{ color: '#ef4444', cursor: 'pointer', fontWeight: 800 }}>⊖</div>
                        </div>
                        <button style={{ width: '100%', padding: '0.6rem', border: '1px dashed #f97316', color: '#f97316', background: 'transparent', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>+ Add Trusted Contact</button>
                      </div>
                      {/* Auto-Share Triggers */}
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#475569' }}>Auto-Share Triggers</h4>
                        <div style={{ background: '#fffaf5', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ffedd5', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Cab Boarding</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Share live location automatically.</div>
                          </div>
                          <label className="switch" style={{ transform: 'scale(0.8)', margin: 0 }}>
                            <input type="checkbox" defaultChecked />
                            <span className="slider" style={{ background: '#f97316' }}></span>
                          </label>
                        </div>
                        <div style={{ background: '#fffaf5', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ffedd5', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Night Travel (10 PM - 6 AM)</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Continuous sharing during night.</div>
                          </div>
                          <label className="switch" style={{ transform: 'scale(0.8)', margin: 0 }}>
                            <input type="checkbox" defaultChecked />
                            <span className="slider" style={{ background: '#f97316' }}></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Safe Stay & SOS */}
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1.8, background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                      <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                         🛏 Safe Stay Priority Filters
                      </h3>
                      <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: '#64748b' }}>Automatically apply these filters when searching.</p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div style={{ flex: 1, padding: '0.8rem', border: '1px solid #fed7aa', background: '#fffaf5', borderRadius: '8px', position: 'relative' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.2rem' }}>Women-Only</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Exclusive to female guests.</div>
                          <div style={{ position: 'absolute', bottom: '8px', right: '8px', color: '#c2410c', fontWeight: 900 }}>☑</div>
                        </div>
                        <div style={{ flex: 1, padding: '0.8rem', border: '1px solid #fed7aa', background: '#fffaf5', borderRadius: '8px', position: 'relative' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.2rem' }}>CCTV Verified</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Common areas actively monitored.</div>
                          <div style={{ position: 'absolute', bottom: '8px', right: '8px', color: '#c2410c', fontWeight: 900 }}>☑</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ flex: 1, background: '#fee2e2', borderRadius: '16px', padding: '1.5rem', border: '1px solid #fca5a5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                      <div style={{ color: '#991b1b', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>⚠ Emergency SOS</div>
                      <div style={{ fontSize: '0.75rem', color: '#991b1b', marginBottom: '1rem' }}>
                        {sosState === 'triggered' ? 'Location Shared!' : 'Sends GPS to 3 contacts + calls 112 immediately.'}
                      </div>
                      <button 
                        onClick={handleSosClick}
                        className={sosState === 'idle' ? 'sos-btn-idle' : sosState === 'countdown' ? 'sos-btn-countdown' : ''}
                        style={{ 
                          width: '80px', 
                          height: '80px', 
                          borderRadius: '50%', 
                          background: sosState === 'triggered' ? '#16a34a' : '#b91c1c', 
                          color: 'white', 
                          border: 'none', 
                          fontWeight: 900, 
                          fontSize: '1.2rem', 
                          cursor: sosState === 'triggered' ? 'default' : 'pointer', 
                          boxShadow: sosState === 'triggered' ? '0 6px 16px rgba(22, 163, 74, 0.4)' : '0 6px 16px rgba(185, 28, 28, 0.4)',
                          transition: 'background 0.3s'
                        }}
                      >
                        {sosState === 'idle' ? 'SOS' : sosState === 'countdown' ? sosCountdown : 'SENT'}
                      </button>
                      <div style={{ fontSize: '0.65rem', color: '#991b1b', marginTop: '0.8rem', height: '12px' }}>
                        {sosState === 'idle' ? 'Click to trigger (3s delay)' : sosState === 'countdown' ? 'Click again to CANCEL' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* Right Column - Map */}
      <div className="uber-right-column" style={{ position: 'relative', borderLeft: '1px solid #e5e7eb' }}>
        <button 
          onClick={() => setIsMapExpanded(!isMapExpanded)}
          style={{
            position: 'absolute',
            left: '-16px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1000,
            background: 'white',
            border: '1px solid #e5e7eb',
            width: '32px',
            height: '64px',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f172a',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
        >
          {isMapExpanded ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        <MapContainer 
          center={mapCenter}  
          zoom={13} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          zoomControl={false}
          key={mapCenter.toString()}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <ZoomControl position="topright" />
          
          <MapUpdater pickupCoord={actualPickupCoord} dropoffCoord={actualDropoffCoord} mapCenter={mapCenter} />
          
          {actualPickupCoord && (
            <Marker position={actualPickupCoord} icon={pickupIcon}>
              <Tooltip permanent direction="right" offset={[15, 0]} className="uber-map-tooltip">
                {pickup}
              </Tooltip>
            </Marker>
          )}

          {actualDropoffCoord && (
            <Marker position={actualDropoffCoord} icon={dropoffIcon}>
              <Tooltip permanent direction="right" offset={[15, 0]} className="uber-map-tooltip">
                {dropoff}
              </Tooltip>
            </Marker>
          )}

          {routeGeometry ? (
            <Polyline positions={routeGeometry} color="#f97316" weight={5} />
          ) : driverGeometry && (bookingState === 'assigned' || bookingState === 'arriving') ? (
            <Polyline positions={driverGeometry} color="#3b82f6" weight={5} dashArray="5, 5" />
          ) : showRoute && actualPickupCoord && actualDropoffCoord ? (
            <Polyline 
              positions={[actualPickupCoord, actualDropoffCoord]} 
              color="#cbd5e1" 
              weight={4} 
              dashArray="10, 10"
            />
          ) : null}

          {carPosition && (
            <Marker 
              position={carPosition}
              icon={L.icon({
                iconUrl: selectedVehicleData?.img || '/vehicles/hatchback.png',
                iconSize: [60, 40],
                iconAnchor: [30, 20]
              })}
              zIndexOffset={1000}
            />
          )}

          {/* Render Nearby Moving Cabs only when selecting a ride to avoid cluttering the actual trip */}
          {bookingState === 'selecting' && nearbyCabs.map(cab => (
            <Marker
              key={`nearby-cab-${cab.id}`}
              position={[cab.lat, cab.lon]}
              icon={createCabIcon(cab.img, cab.headingRight)}
              zIndexOffset={500}
            />
          ))}
        </MapContainer>
      </div>
    </div>
    </div>
  );
};

export default Rides;
