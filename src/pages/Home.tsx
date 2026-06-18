import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  PlaneTakeoff, 
  PlaneLanding, 
  Users, 
  Zap, 
  BarChart2, 
  ShieldCheck, 
  Star, 
  Globe,
  ChevronDown
} from 'lucide-react';

const destinations = [
  "Delhi",
  "Hyderabad",
  "Varanasi",
  "Udaipur",
  "Bangalore",
  "Jaipur",
  "Mumbai",
  "Kolkata",
  "Sikkim",
  "Chennai",
  "Agra",
  "Rishikesh",
  "Goa",
  "Leh, Ladakh",
  "Munnar",
  "Amritsar"
];

const Home = () => {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(100000);
  const [tripType, setTripType] = useState('Group');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [fromCity, setFromCity] = useState(localStorage.getItem('fromCity') || '');
  const [toCity, setToCity] = useState('');

  const todayDate = new Date().toISOString().split('T')[0];

  const budgetPercent = ((budget - 1000) / (500000 - 1000)) * 100;

  const handleTravelersChange = (val: number) => {
    if (isNaN(val) || val < 1 || val > 12) return;
    setTravelers(val);
    if (val === 1) setTripType('Solo');
    else if (val >= 2 && val <= 4) setTripType('Family');
    else setTripType('Group');
  };

  const handleTripTypeClick = (type: string) => {
    setTripType(type);
    if (type === 'Solo') setTravelers(1);
    else if (type === 'Family') setTravelers(4);
    else if (type === 'Group') setTravelers(6);
  };

  const handlePlanTrip = () => {
    if (!toCity || !startDate || !endDate || !budget) {
      alert("Please select your destination, travel dates, and budget before proceeding to plan your trip.");
      return;
    }
    if (fromCity === toCity) {
      alert("Origin and destination cannot be the same city. Please select different cities.");
      return;
    }
    navigate(`/plan-trip?to=${toCity}&from=${fromCity}&start=${startDate}&end=${endDate}&budget=${budget}&travelers=${travelers}`);
  };

  return (
    <>
      {/* Main Content */}
      <main className="main-content">
        {/* Left Column */}
        <div className="hero-text-section animate-fade-in">
          <h1 className="hero-title">
            Your Ultimate Squad <br />
            Trip,<br />
            <span className="text-orange">Fully Automated.</span>
          </h1>
          <div className="hero-subtitle-box">
            <p>
              <span className="text-yellow">The smartest AI planner</span> to lock prices, split bills, and skip the group-chat drama.
            </p>
          </div>
        </div>

        {/* Right Column - Booking Widget */}
        <Tilt 
          tiltMaxAngleX={4} 
          tiltMaxAngleY={4} 
          perspective={1200} 
          transitionSpeed={1500} 
          scale={1.015}
          glareEnable={true} 
          glareMaxOpacity={0.12} 
          glarePosition="all"
          className="animate-fade-in delay-200"
        >
          <div className="booking-widget">
            <div className="form-row">
            <div className="form-group">
              <label style={{ color: '#3b82f6' }}>From Origin</label>
              <div className="input-with-icon" style={{ borderColor: 'rgba(59, 130, 246, 0.3)', position: 'relative' }}>
                <MapPin size={18} style={{ color: '#3b82f6', minWidth: '18px' }} />
                <select value={fromCity} onChange={(e) => { setFromCity(e.target.value); localStorage.setItem('fromCity', e.target.value); }} className="destination-select" style={{ color: '#1e3a8a', paddingRight: '2rem' }}>
                  <option value="" disabled hidden>Select Origin</option>
                  {destinations.map(dest => (
                    <option key={dest} value={dest} disabled={dest === toCity}>{dest}</option>
                  ))}
                </select>
                <ChevronDown size={18} style={{ color: '#3b82f6', pointerEvents: 'none', position: 'absolute', right: '1.25rem' }} />
              </div>
            </div>
            <div className="form-group">
              <label style={{ color: '#f59e0b' }}>To Destination</label>
              <div className="input-with-icon" style={{ borderColor: 'rgba(245, 158, 11, 0.3)', position: 'relative' }}>
                <MapPin size={18} style={{ color: '#f59e0b', minWidth: '18px' }} />
                <select value={toCity} onChange={(e) => setToCity(e.target.value)} className="destination-select" style={{ color: '#78350f', paddingRight: '2rem' }}>
                  <option value="" disabled hidden>Select Destination</option>
                  {destinations.map(dest => (
                    <option key={dest} value={dest} disabled={dest === fromCity}>{dest}</option>
                  ))}
                </select>
                <ChevronDown size={18} style={{ color: '#f59e0b', pointerEvents: 'none', position: 'absolute', right: '1.25rem' }} />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label style={{ color: '#8b5cf6' }}>Departure</label>
              <div className="input-with-icon date-input-wrapper" style={{ borderColor: 'rgba(139, 92, 246, 0.3)' }}>
                <PlaneTakeoff size={18} style={{ color: '#8b5cf6' }} />
                <input 
                  type="date" 
                  value={startDate}
                  min={todayDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="styled-date-input"
                  style={{ color: '#5b21b6' }}
                />
              </div>
            </div>
            <div className="form-group">
              <label style={{ color: '#10b981' }}>Arrival</label>
              <div className="input-with-icon date-input-wrapper" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <PlaneLanding size={18} style={{ color: '#10b981' }} />
                <input 
                  type="date" 
                  value={endDate}
                  min={startDate || todayDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="styled-date-input"
                  style={{ color: '#047857' }}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label style={{ color: '#ef4444' }}>Travelers & Squad Size</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <div className="input-with-icon" style={{ flexShrink: 0, width: '110px', background: '#fff' }}>
                  <Users size={18} className="icon-red" />
                  <input 
                    type="number" 
                    value={travelers} 
                    onChange={(e) => handleTravelersChange(parseInt(e.target.value))}
                    min="1" 
                    max="12" 
                    className="styled-number-input"
                    style={{ color: '#ef4444', fontWeight: 700, fontSize: '1.2rem' }}
                  />
                </div>
                
                <input 
                  type="range" 
                  min="1" 
                  max="12" 
                  value={travelers} 
                  onChange={(e) => handleTravelersChange(parseInt(e.target.value))} 
                  className="budget-slider"
                  style={{ 
                    flex: 1, 
                    height: '8px',
                    background: `linear-gradient(to right, #ef4444 ${(travelers - 1) * (100 / 11)}%, #e2e8f0 ${(travelers - 1) * (100 / 11)}%)` 
                  }}
                />
              </div>
            </div>
          </div>

          <div className="form-group budget-group">
            <div className="budget-header">
              <label>Budget Range (₹)</label>
              <span className="budget-value">₹{budget.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="1000" 
              max="500000" 
              value={budget} 
              onChange={(e) => setBudget(Number(e.target.value))} 
              className="budget-slider"
              style={{ background: `linear-gradient(to right, #ef4444 ${budgetPercent}%, #e2e8f0 ${budgetPercent}%)` }}
            />
          </div>

          <div className="form-group">
            <label>Trip Type</label>
            <div className="trip-type-selector">
              {['Group', 'Solo', 'Family'].map(type => (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={type}
                  className={`trip-type-btn ${tripType === type ? 'active' : ''}`}
                  onClick={() => handleTripTypeClick(type)}
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="plan-trip-btn" 
            onClick={handlePlanTrip}
          >
            Plan Trip <Zap size={18} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="forecast-btn" 
            onClick={() => navigate('/price-forecaster')}
          >
            <BarChart2 size={18} /> Forecast Price
          </motion.button>
          </div>
        </Tilt>
      </main>

      {/* Floating Badges */}
      <div className="floating-badges animate-fade-in delay-400">
        <motion.div whileHover={{ scale: 1.1, y: -5 }} whileTap={{ scale: 0.95 }} className="badge">
          <ShieldCheck size={14} className="badge-icon-yellow" /> Secure Payments
        </motion.div>
        <motion.div whileHover={{ scale: 1.1, y: -5 }} whileTap={{ scale: 0.95 }} className="badge">
          <Star size={14} className="badge-icon-yellow" /> 4.8 Rated
        </motion.div>
        <motion.div whileHover={{ scale: 1.1, y: -5 }} whileTap={{ scale: 0.95 }} className="badge">
          <Globe size={14} className="badge-icon-gray" /> 10,000+ Trips Planned
        </motion.div>
      </div>
    </>
  );
};

export default Home;
