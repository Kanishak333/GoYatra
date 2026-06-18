import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, Lightbulb, Map as MapIcon, Check, Globe, Heart, Search, MapPin, ChevronRight } from 'lucide-react';
import { fetchAccommodations } from '../services/travelService';
import UdaipurMap from '../components/UdaipurMap';
import TravelTipsModal from '../components/TravelTipsModal';

const udaipurDescriptions: Record<string, string> = {
  "udaipur-1": "Picturesque views of Lake Pichola with sprawling gardens, perfect for a peaceful retreat.",
  "udaipur-4": "Opulent architecture nestled near Fateh Sagar Lake, featuring luxurious pools and grand dining.",
  "udaipur-5": "Perched on the hills with majestic valleys and lakes below, offering a royal lifestyle experience.",
  "udaipur-6": "A boutique heritage stay facing Swaroop Sagar Lake, combining modern comfort with Rajputana charm.",
  "udaipur-7": "Famous for its rooftop pool and romantic white interiors, an oasis in the heart of the old city.",
  "udaipur-8": "Perched on Ambavgarh hill offering stunning panoramic views of Lake Fatehsagar and the city.",
  "udaipur-9": "A premium yet affordable stay offering vibrant aesthetics and close proximity to cultural spots.",
  "udaipur-10": "Modern amenities and cozy rooms, ideal for travelers seeking comfort near the city center.",
  "udaipur-11": "A palatial resort boasting the city's largest pool and exquisite lakeside views of Fateh Sagar.",
  "udaipur-12": "Lively hostel vibe with a rooftop cafe, perfect for solo travelers meeting over lake sunsets.",
  "udaipur-13": "An exclusive private island resort on Udai Sagar Lake, offering unparalleled luxury and serenity.",
  "udaipur-14": "Nestled on a private island in Jaisamand Lake, offering tranquil nature walks and bird watching.",
  "udaipur-15": "Contemporary design and central location, providing an easy base to explore Udaipur's attractions.",
  "udaipur-16": "A historic palace offering breathtaking views of Fateh Sagar Lake and the Aravalli hills.",
  "udaipur-17": "Steeped in Mewari history, featuring antique decor and direct access to the City Palace complex.",
  "udaipur-18": "World-renowned luxury with intricate domes, reflecting pools, and impeccable personalized service.",
  "udaipur-19": "Set amidst the Aravalli ranges, featuring 117 villa-styled keys and stunning landscape views.",
  "udaipur-21": "Modern luxury meets regal splendor with ESPA tented spa and sweeping views of City Palace.",
  "udaipur-22": "An iconic floating marble palace offering private boat rides, Jiva Spa boat, and royal butler service.",
  "udaipur-23": "Located in Sector 9, Complimentary INR 500 Hotel Credit redeemable on Food & Beverages.",
  "udaipur-24": "9 minutes walk to Badi Lake, large pool overlooking Nathwaton Ka Gurha hills.",
  "udaipur-25": "Entire 3-Bedroom Villa in Thoor, Riverside views with expansive lawns.",
  "udaipur-26": "Located in Sukher, Free Cancellation till 24 hrs before check-in.",
  "udaipur-27": "About a minute walk to Lake Pichola, beautifully lit cafe seating.",
  "udaipur-28": "Sector 3 location, Rooftop restaurant and bar, spacious and clean rooms.",
  "udaipur-29": "Located in Hiran Magri, Easy access to city viewpoints, peaceful environment.",
  "udaipur-30": "Surrounded by the Aravalli range, open play area and yoga, amazing infrastructure and interiors.",
  "udaipur-31": "Located 25.8 km from city centre, featuring Complimentary Hi-Tea and serene ambiance.",
  "udaipur-32": "920 m drive to City Palace, stunning rooftop pool overlooking historical sights.",
  "udaipur-33": "Located in Pahada, featuring Long Stay Benefits and 15% off Food & Beverage services.",
  "udaipur-34": "Near Kumbhalgarh Fort, offering suites with private pool & Jacuzzi, plus Complimentary INR 500 Hotel Credit."
};

// --- MOCK DATA SEEDER ---
// A simple hash function to assign deterministic rules based on hotel ID
const getMockHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return hash;
};

const PlanTrip = () => {
  const [searchParams] = useSearchParams();
  const [destination] = useState(searchParams.get('to') || '');
  const [startDate] = useState(searchParams.get('start') || '');
  const [endDate] = useState(searchParams.get('end') || '');
  const [budget, setBudget] = useState(searchParams.get('budget') || '');
  const [travelers] = useState(searchParams.get('travelers') || '');
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]);
  const [searchedCity, setSearchedCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Booking states
  const [bookedHotels, setBookedHotels] = useState<string[]>([]);
  const [bookingHotelId, setBookingHotelId] = useState<string | null>(null);
  
  // Sort State
  const [sortActive, setSortActive] = useState('Nearest to Center');
  const [pricePref, setPricePref] = useState('Price per Night');
  
  // Modal State
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);

  // Filter States
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!destination.trim()) return;
    setLoading(true);
    setSearchedCity(destination);
    try {
      const result = await fetchAccommodations(destination);
      if (result && result.data && result.data.accommodations) {
        setHotels(result.data.accommodations);
      } else {
        setHotels([]);
      }
    } catch (err) {
      console.error(err);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  // Filter Toggle Helper
  const toggleFilter = (state: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    if (state.includes(value)) {
      setter(state.filter(v => v !== value));
    } else {
      setter([...state, value]);
    }
  };

  // The Filter Engine
  const filteredHotels = useMemo(() => {
    return hotels.filter(hotel => {
      // 1. Price Filter
      if (selectedPrices.length > 0) {
        const p = hotel.price;
        const matchesPrice = selectedPrices.some(range => {
          if (range === '₹0 - ₹1500') return p >= 0 && p <= 1500;
          if (range === '₹1500 - ₹2500') return p > 1500 && p <= 2500;
          if (range === '₹2500 - ₹6000') return p > 2500 && p <= 6000;
          if (range === '₹6000 - ₹9500') return p > 6000 && p <= 9500;
          if (range === '₹9500 - ₹13000') return p > 9500 && p <= 13000;
          if (range === '₹13000 - ₹15000') return p > 13000 && p <= 15000;
          if (range === '₹15000 - ₹30000') return p > 15000 && p <= 30000;
          if (range === '₹30000+') return p > 30000;
          return false;
        });
        if (!matchesPrice) return false;
      }

      // 2. Star Category
      if (selectedStars.length > 0) {
        const ratingNum = parseFloat(hotel.rating);
        const matchesStar = selectedStars.some(starStr => {
          const starVal = parseInt(starStr.split(' ')[0]); // "4 Star" -> 4
          return ratingNum >= starVal && ratingNum < starVal + 1;
        });
        if (!matchesStar) return false;
      }

      // 3. Property Type
      if (selectedTypes.length > 0) {
        const typeMatch = selectedTypes.some(type => hotel.type.toLowerCase().includes(type.toLowerCase()));
        if (!typeMatch) return false;
      }

      // 4. Chains
      if (selectedChains.length > 0) {
        const chainMatch = selectedChains.some(chain => hotel.name.toLowerCase().includes(chain.toLowerCase()));
        if (!chainMatch) return false;
      }

      // 5. House Rules (Mock Deterministic)
      if (selectedRules.length > 0) {
        const h = getMockHash(hotel.id || hotel.name);
        const rulesMatch = selectedRules.every(rule => {
          if (rule === 'Alcohol Allowed') return h % 2 === 0;
          if (rule === 'Pets Allowed') return h % 3 === 0;
          if (rule === 'Smoking Allowed') return h % 4 === 0;
          return true; // default allow for others
        });
        if (!rulesMatch) return false;
      }

      // 6. Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = hotel.name.toLowerCase().includes(query);
        const matchesLocality = hotel.type && hotel.type.toLowerCase().includes(query);
        if (!matchesName && !matchesLocality) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortActive === 'Price (Low to High)') return a.price - b.price;
      if (sortActive === 'Price (High to Low)') return b.price - a.price;
      if (sortActive === 'User Rating (Highest)') {
        const ratingA = parseFloat(a.rating) || 0;
        const ratingB = parseFloat(b.rating) || 0;
        return ratingB - ratingA;
      }
      if (sortActive === 'Lowest Price & Best Rated') {
        const scoreA = a.price - (parseFloat(a.rating) || 0) * 1000;
        const scoreB = b.price - (parseFloat(b.rating) || 0) * 1000;
        return scoreA - scoreB;
      }
      // Default: 'Nearest to Center' (mocked by ID length or keeping original order)
      return 0;
    });
  }, [hotels, selectedPrices, selectedStars, selectedTypes, selectedChains, selectedRules, sortActive, searchQuery]);

  // Helper component for rendering filter sections
  const FilterSection = ({ title, options, state, setter }: { title: string, options: string[], state: string[], setter: any }) => (
    <div className="filter-section" style={{ marginBottom: '1.5rem' }}>
      <h4 className="filter-title">{title}</h4>
      {options.map(opt => {
        const count = Math.floor(Math.random() * 500); // Mock counts
        return (
          <label key={opt} className="checkbox-label filter-item">
            <div style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
              <input 
                type="checkbox" 
                checked={state.includes(opt)}
                onChange={() => toggleFilter(state, setter, opt)}
              /> 
              {opt}
            </div>
            <span className="filter-count">({count})</span>
          </label>
        );
      })}
    </div>
  );

  return (
    <main className="main-content mmt-light-theme" style={{ display: 'block', paddingTop: '1.5rem', paddingBottom: '4rem', background: '#f1f5f9', minHeight: '100vh', color: '#0f172a' }}>
      
      {startDate && endDate && (
        <div className="trip-summary-bar" style={{ 
          background: 'rgba(30, 41, 59, 0.85)', 
          border: '1px solid #ff5a00', 
          borderRadius: '16px', 
          padding: '1rem 2rem', 
          marginBottom: '2rem', 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '4rem',
          boxShadow: '0 0 20px rgba(255, 90, 0, 0.4), inset 0 0 10px rgba(255, 90, 0, 0.1)',
          color: 'white',
          fontWeight: 600,
          backdropFilter: 'blur(20px)',
          fontSize: '1.1rem'
        }}>
          <div className="summary-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <span style={{ color: '#ff5a00' }}>📅 Dates:</span> 
             {startDate} to {endDate}
          </div>
          <div className="summary-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <span style={{ color: '#ff5a00' }}>💸 Budget:</span> 
             ₹{Number(budget).toLocaleString()}
          </div>
          <div className="summary-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <span style={{ color: '#ff5a00' }}>👥 Travelers:</span> 
             {travelers}
          </div>
        </div>
      )}

      <div className="search-layout-container mmt-layout">
        
        {/* LEFT SIDEBAR */}
        <aside className="sidebar-filters mmt-sidebar">
          {searchedCity.toLowerCase() === 'udaipur' ? (
            <UdaipurMap hotels={filteredHotels} />
          ) : (
            <div className="mmt-map-card">
              <div className="mmt-map-img"></div>
              <button className="mmt-map-btn">EXPLORE ON MAP <MapPin size={14} /></button>
            </div>
          )}

          <div className="mmt-filter-search" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={16} color="#64748b" />
            <input 
              type="text" 
              placeholder="Search for locality / hotel name" 
              className="mmt-filter-search-input" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, paddingRight: searchQuery ? '24px' : '0' }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '14px', padding: '4px' }}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>


          <FilterSection 
            title="Suggested For You" 
            options={['5 Star', '4 Star', 'Breakfast Included', 'GoYatra VIP']} 
            state={selectedRules} 
            setter={setSelectedRules} 
          />

          <div className="filter-section" style={{ marginBottom: '1.5rem' }}>
            <h4 className="filter-title">Preference</h4>
            <label className="radio-label filter-item">
              <div style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
                <input type="radio" name="pref" checked={pricePref === 'Price per Night'} onChange={() => setPricePref('Price per Night')} /> 
                Price per Night
              </div>
            </label>
            <label className="radio-label filter-item">
              <div style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
                <input type="radio" name="pref" checked={pricePref === 'Total Price'} onChange={() => setPricePref('Total Price')} /> 
                Total Price <span style={{ background:'#ff5a00', color:'white', fontSize:'0.7rem', padding:'2px 6px', borderRadius:'10px', marginLeft:'4px'}}>New</span>
              </div>
            </label>
            <p style={{ color:'#64748b', fontSize:'0.8rem', marginLeft:'2rem', marginTop:'-0.5rem' }}>All nights & rooms excluding taxes</p>
          </div>

          <FilterSection 
            title="Price Per Night" 
            options={['₹0 - ₹1500', '₹1500 - ₹2500', '₹2500 - ₹6000', '₹6000 - ₹9500', '₹9500 - ₹13000', '₹13000 - ₹15000', '₹15000 - ₹30000', '₹30000+']} 
            state={selectedPrices} 
            setter={setSelectedPrices} 
          />

          <FilterSection 
            title="Star Category" 
            options={['3 Star', '4 Star', '5 Star']} 
            state={selectedStars} 
            setter={setSelectedStars} 
          />

          <FilterSection 
            title="Property Type" 
            options={['Hotel', 'Homestay', 'Apartment', 'Guest House', 'Hostel', 'Villa', 'Resort', 'Camp']} 
            state={selectedTypes} 
            setter={setSelectedTypes} 
          />

          <FilterSection 
            title="House Rules" 
            options={['Alcohol Allowed', 'Pets Allowed', 'Self Check-In Available', 'Smoking Allowed', 'All Male Groups Allowed', 'Unmarried Couples Allowed']} 
            state={selectedRules} 
            setter={setSelectedRules} 
          />

          <FilterSection 
            title="Chains" 
            options={['Taj', 'Radisson', 'Oyo Hotels', 'FabHotels', 'Treebo Hotels', 'GoStops', 'Zostel']} 
            state={selectedChains} 
            setter={setSelectedChains} 
          />
        </aside>

        {/* RIGHT CONTENT */}
        <div className="results-container mmt-results">
          
          <div className="mmt-breadcrumbs">
            <a href="#">Home</a> <ChevronRight size={12} /> <span>Hotels and more in {searchedCity || destination || 'City'}</span>
          </div>

          <div className="results-header mmt-results-header">
            <h1 className="results-title">
              {loading ? 'Searching...' : `${filteredHotels.length} Properties in ${searchedCity || destination}`}
            </h1>
            <button className="explore-tips-btn mmt-explore-tips" onClick={() => setShowTipsModal(true)}>
              <Lightbulb size={16} color="#3b82f6" /> Explore Travel Tips <ArrowRight size={14} />
            </button>
          </div>

          <div className="sorting-bar mmt-sorting-bar">
            {['Price (Low to High)', 'Price (High to Low)', 'User Rating (Highest)', 'Lowest Price & Best Rated', `Nearest to ${searchedCity || 'City Center'}`].map((sortOption) => (
              <div 
                key={sortOption} 
                className={`sort-pill mmt-sort-tab ${sortActive === sortOption ? 'active' : ''}`}
                onClick={() => setSortActive(sortOption)}
              >
                {sortOption}
              </div>
            ))}
          </div>

          <div className="promo-banner-new">
            <div className="promo-left">
              <h2>GoYatra Circle Rewards</h2>
            </div>
            <div className="promo-center">
              <Globe size={50} className="globe-icon" />
            </div>
            <div className="promo-right">
              <p>Earn & redeem points on eligible properties for massive savings!</p>
              <button className="learn-more-btn" onClick={() => setIsRewardsModalOpen(true)}>Learn More</button>
            </div>
          </div>

          {loading ? (
            <div className="loading-state glass-panel">
              <div className="spinner"></div>
              <p style={{ color: 'white' }}>Finding the best stays...</p>
            </div>
          ) : filteredHotels.length > 0 ? (
            <div className="hotel-list">
              {filteredHotels.map((hotel, idx) => {
                const taxes = Math.floor(hotel.price * 0.18);
                const isTrending = getMockHash(hotel.id || hotel.name) % 5 === 0;
                return (
                  <div key={hotel.id || idx} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="horizontal-hotel-card mmt-hotel-card">
                    {/* Left: Image */}
                    <div className="hhc-image-section">
                      <img 
                        src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'} 
                        alt={hotel.name} 
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542314831-c6a4d27d6684?w=800&q=80'; }}
                      />
                      <div className="mmt-heart-icon">
                        <Heart size={18} color="#fff" />
                      </div>
                      <div className="mmt-image-dots">
                        <span></span><span className="active"></span><span></span><span></span>
                      </div>
                      <div className="hhc-photo-badge mmt-photo-badge">
                        111 Photos & Videos <ArrowRight size={12} />
                      </div>
                      {isTrending && (
                        <div className="mmt-trending-badge">TRENDING</div>
                      )}
                    </div>
                    
                    {/* Middle: Details */}
                    <div className="hhc-info-section mmt-info-section">
                        <div className="mmt-card-main-info">
                          <h3 className="mmt-hotel-name">
                            {hotel.name}
                          </h3>
                          <div className="hhc-location mmt-hotel-location">
                            <a href="#">{searchedCity || 'City Center'}</a> | {hotel.type || '2.2 km drive to Fateh Sagar Lake'}
                          </div>
                        </div>

                      <div className="hhc-perks mmt-hotel-perks">
                        {hotel.perks ? hotel.perks.map((perk: string, i: number) => (
                          <div key={i} className="hhc-perk mmt-perk">
                            <Check size={14} className="mmt-check" /> {perk}
                          </div>
                        )) : (
                          <>
                            <div className="hhc-perk mmt-perk">
                              <Check size={14} className="mmt-check" /> Free Cancellation
                            </div>
                            <div className="hhc-perk mmt-perk">
                              <Check size={14} className="mmt-check" /> Book with ₹0 Payment
                            </div>
                          </>
                        )}
                        <div className="hhc-perk mmt-highlight-perk">
                          <span className="mmt-sparkle">✨</span> {udaipurDescriptions[hotel.id] || "A highly rated property offering comfortable stays and excellent service."}
                        </div>
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="mmt-card-divider"></div>

                    {/* Right: Price & CTA */}
                    <div className="hhc-price-section mmt-price-section">
                      <div className="hhc-rating-badge mmt-rating-badge">
                        <div className="mmt-rating-top">
                          <span className="mmt-rating-label">Excellent</span> 
                          <span className="mmt-rating-score">
                            {hotel.rating?.split('★')[0].trim() || '4.8'}
                          </span>
                        </div>
                        <div className="mmt-rating-count">({hotel.ratingCount || '499 Ratings'})</div>
                      </div>

                      <div className="hhc-price-box mmt-price-box">
                        <div className="hhc-price mmt-price">₹ {(hotel.price || 33000).toLocaleString()}</div>
                        <div className="hhc-taxes mmt-taxes">+ ₹ {(hotel.taxes || taxes).toLocaleString()} taxes & fees</div>
                        <div className="mmt-per-night" style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'right', marginBottom: '0.5rem' }}>Per Night</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                          {bookedHotels.includes(hotel.id) && (
                            <button
                              onClick={() => {
                                setBookedHotels(prev => prev.filter(id => id !== hotel.id));
                                if (budget && !isNaN(Number(budget))) {
                                  setBudget((Number(budget) + hotel.price).toString());
                                }
                              }}
                              style={{
                                color: 'white',
                                background: '#ef4444',
                                fontSize: '0.75rem',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                              }}
                            >
                              Cancel booking
                            </button>
                          )}
                          <button 
                            className="reserve-btn" 
                            disabled={bookedHotels.includes(hotel.id)}
                            style={{
                              background: bookedHotels.includes(hotel.id) ? '#10b981' : 'linear-gradient(93deg, #53b2fe, #065af3)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '8px 24px',
                              fontWeight: '700',
                              cursor: bookedHotels.includes(hotel.id) ? 'default' : 'pointer',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                              transition: 'background 0.3s'
                            }}
                            onClick={() => {
                              if (!bookedHotels.includes(hotel.id)) {
                                setBookingHotelId(hotel.id);
                                setTimeout(() => {
                                  setBookingHotelId(null);
                                  setBookedHotels(prev => [...prev, hotel.id]);
                                  if (budget && !isNaN(Number(budget))) {
                                    setBudget((Number(budget) - hotel.price).toString());
                                  }
                                }, 2000);
                              }
                            }}
                          >
                            {bookedHotels.includes(hotel.id) ? (
                              <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}><Check size={16} /> Booked</span>
                            ) : 'Reserve'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {hotel.offer && (
                    <div className="mmt-hotel-offer">
                      {hotel.offer}
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          ) : (
            <div className="empty-state mmt-empty-state">
              <MapIcon size={48} color="#94a3b8" style={{ marginBottom: '1rem', opacity: 0.5, margin: '0 auto 1rem auto' }} />
              <h3 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>
                {searchedCity ? 'No properties found' : 'Select a destination'}
              </h3>
              <p style={{ color: '#64748b' }}>
                {searchedCity ? 'Try adjusting your filters or search criteria.' : 'Please enter a destination in the search bar above to plan your trip.'}
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Booking Loading Overlay */}
      {bookingHotelId && (
        <div className="booking-overlay">
          <div className="booking-animation-container">
            <div className="hotel-2d-animation">
              <div className="css-hotel-wrapper">
                <div className="css-hotel-sign">HOTEL</div>
                <div className="css-hotel-body">
                  <div className="css-hotel-windows"></div>
                  <div className="css-hotel-entrance">
                    <div className="css-hotel-awning"></div>
                    <div className="css-hotel-door"></div>
                  </div>
                </div>
              </div>
              <div className="hotel-2d-sparkles">✨</div>
            </div>
            <div className="booking-text">Confirming your reservation...</div>
          </div>
        </div>
      )}

      {/* Rewards Modal */}
      {isRewardsModalOpen && (
        <div className="rewards-modal-overlay" onClick={() => setIsRewardsModalOpen(false)}>
          <div className="rewards-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setIsRewardsModalOpen(false)}>&times;</button>
            <img src="/rewards-modal.png" alt="GoYatra Circle Rewards" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px' }} />
          </div>
        </div>
      )}

      {/* Travel Tips Modal */}
      {showTipsModal && (
        <TravelTipsModal 
          onClose={() => setShowTipsModal(false)} 
          city={searchedCity || destination || 'Delhi'} 
        />
      )}
    </main>
  );
};

export default PlanTrip;
