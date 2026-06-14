import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, Lightbulb, Map as MapIcon, Image as ImageIcon, ChevronRight, Check, Globe } from 'lucide-react';
import { fetchAccommodations } from '../services/travelService';

// --- MOCK DATA SEEDER ---
// A simple hash function to assign deterministic rules based on hotel ID
const getMockHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return hash;
};

const PlanTrip = () => {
  const [searchParams] = useSearchParams();
  const [destination] = useState(searchParams.get('to') || 'Varanasi');
  const [startDate] = useState(searchParams.get('start') || '');
  const [endDate] = useState(searchParams.get('end') || '');
  const [budget] = useState(searchParams.get('budget') || '');
  const [travelers] = useState(searchParams.get('travelers') || '');
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]);
  const [searchedCity, setSearchedCity] = useState('');
  
  // Sort State
  const [sortActive, setSortActive] = useState('Nearest to Center');
  const [pricePref, setPricePref] = useState('Price per Night');

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
  }, [hotels, selectedPrices, selectedStars, selectedTypes, selectedChains, selectedRules, sortActive]);

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
    <main className="main-content animate-fade-in" style={{ display: 'block', paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      
      {startDate && endDate && (
        <div className="trip-summary-bar" style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
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

      <div className="search-layout-container">
        
        {/* LEFT SIDEBAR */}
        <aside className="sidebar-filters" style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>


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
        <div className="results-container">
          
          <div className="results-header">
            <h1 className="results-title">
              {loading ? 'Searching...' : `${filteredHotels.length} Properties in ${searchedCity || destination}`}
            </h1>
            <button className="explore-tips-btn">
              <Lightbulb size={16} color="#eab308" /> Explore Travel Tips <ChevronRight size={14} />
            </button>
          </div>

          <div className="sorting-bar">
            {['Price (Low to High)', 'Price (High to Low)', 'User Rating (Highest)', 'Lowest Price & Best Rated', 'Nearest to Center'].map(sortOption => (
              <div 
                key={sortOption} 
                className={`sort-pill ${sortActive === sortOption ? 'active' : ''}`}
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
              <button className="learn-more-btn">Learn More</button>
            </div>
          </div>

          <h3 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.4rem' }}>Showing Properties in {searchedCity || destination}</h3>

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
                    <div className="horizontal-hotel-card" style={{ marginBottom: hotel.offer ? '0' : '1.5rem', zIndex: 2, position: 'relative' }}>
                    {/* Left: Image */}
                    <div className="hhc-image-section">
                      <img 
                        src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'} 
                        alt={hotel.name} 
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542314831-c6a4d27d6684?w=800&q=80'; }}
                      />
                      <div className="hhc-photo-badge">
                        <ImageIcon size={14} /> 33 Photos & Videos <ArrowRight size={14} />
                      </div>
                      {isTrending && (
                        <div style={{ position:'absolute', top:'1rem', left:'0', background:'#ef4444', color:'white', padding:'0.2rem 0.8rem', borderTopRightRadius:'12px', borderBottomRightRadius:'12px', fontSize:'0.8rem', fontWeight:'bold' }}>
                          TRENDING
                        </div>
                      )}
                    </div>
                    
                    {/* Middle: Details */}
                    {/* Middle: Details */}
                    <div className="hhc-info-section">
                      <div className="hhc-header">
                        <div>
                          {hotel.badge && (
                            <div style={{ display: 'inline-block', border: '1px solid #d4af37', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, color: '#d4af37', marginBottom: '0.5rem' }}>
                              {hotel.badge}
                            </div>
                          )}
                          <h4 className="hhc-name" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {hotel.name} 
                            {(hotel.badge || hotel.name.includes('StayVista')) && (
                              <span style={{ color: '#000', letterSpacing: '2px', fontSize: '1rem' }}>★★★★★</span>
                            )}
                          </h4>
                          <div className="hhc-location" style={{ color: '#0ea5e9', marginTop: '0.2rem' }}>
                            <span>{hotel.locationDesc || `${searchedCity || 'City Center'} | ${hotel.type || 'Luxury Stay'}`}</span>
                          </div>
                          {hotel.roomType && (
                            <div style={{ fontWeight: 700, marginTop: '0.5rem', fontSize: '0.9rem', color: '#000' }}>
                              <span style={{ color: '#38bdf8', marginRight: '6px' }}>|</span> {hotel.roomType}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="hhc-perks" style={{ marginTop: '1rem' }}>
                        {hotel.perks ? hotel.perks.map((perk: string, i: number) => (
                          <div key={i} className="hhc-perk" style={{ color: '#10b981' }}>
                            <Check size={16} /> {perk}
                          </div>
                        )) : (
                          <>
                            <div className="hhc-perk">
                              <Check size={16} /> Book with ₹0 Payment
                            </div>
                            <div className="hhc-perk" style={{ color: '#0ea5e9' }}>
                              <span style={{ fontSize:'1rem', marginRight:'4px' }}>•</span> Enjoy 500 credits on F&B!
                            </div>
                          </>
                        )}
                        {hotel.reviewHighlight && (
                          <div className="hhc-perk" style={{ color: '#3b82f6', marginTop: '0.5rem' }}>
                            <span style={{ fontSize:'1rem', marginRight:'4px' }}>✨</span> {hotel.reviewHighlight}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Price & CTA */}
                    <div className="hhc-price-section">
                      <div className="hhc-rating-badge">
                        <div className="rating-score-box">
                          <span style={{ color: '#1e40af', fontWeight: 700, marginRight: '6px' }}>{hotel.ratingLabel || 'Very Good'}</span> 
                          <span style={{ background:'#1e40af', color:'white', padding: '4px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.9rem' }}>
                            {hotel.rating?.split('★')[0].trim() || '4.5'}
                          </span>
                        </div>
                        <span className="rating-text" style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>({hotel.ratingCount || '483 Ratings'})</span>
                      </div>

                      <div className="hhc-price-box" style={{ textAlign: 'right', marginTop: 'auto' }}>
                        {hotel.dealLabel && (
                          <div style={{ color: '#059669', border: '1px solid #059669', borderRadius: '12px', padding: '2px 8px', fontSize: '0.7rem', display: 'inline-block', marginBottom: '4px' }}>
                            {hotel.dealLabel}
                          </div>
                        )}
                        {hotel.originalPrice && (
                          <div style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.9rem' }}>
                            ₹ {hotel.originalPrice.toLocaleString()}
                          </div>
                        )}
                        <div className="hhc-price" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>₹ {(hotel.price || 57331).toLocaleString()}</div>
                        <div className="hhc-taxes" style={{ color: '#64748b', fontSize: '0.85rem' }}>+ ₹ {(hotel.taxes || taxes).toLocaleString()} taxes & fees</div>
                        <div style={{ color:'#94a3b8', fontSize:'0.85rem', marginBottom:'1rem' }}>Per Night</div>
                        <a href="#" style={{ color: '#3b82f6', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500 }}>Login to Book Now & Pay Later!</a>
                      </div>
                    </div>
                  </div>
                  
                  {hotel.offer && (
                    <div style={{ background: '#dcfce7', padding: '0.6rem 1rem', fontSize: '0.85rem', color: '#065f46', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', marginTop: '-12px', zIndex: 1, position: 'relative', marginBottom: '1.5rem' }}>
                      {hotel.offer}
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          ) : (
            <div className="empty-state glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
              <MapIcon size={48} className="icon-muted" style={{ marginBottom: '1rem', opacity: 0.5, margin: '0 auto 1rem auto' }} />
              <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No properties found</h3>
              <p style={{ color: '#94a3b8' }}>Try adjusting your filters or search criteria.</p>
            </div>
          )}

        </div>
      </div>
    </main>
  );
};

export default PlanTrip;
