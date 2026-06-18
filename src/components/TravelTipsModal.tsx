import React from 'react';
import { 
  X, 
  MapPin, 
  Hand, 
  Bus, 
  Sun, 
  Search, 
  Globe, 
  ChevronLeft, 
  ChevronRight,
  Shirt,
  Footprints,
  Coffee,
  SunDim
} from 'lucide-react';
import './TravelTipsModal.css';

interface TravelTipsModalProps {
  onClose: () => void;
  city: string;
}

const TravelTipsModal: React.FC<TravelTipsModalProps> = ({ onClose, city }) => {
  // Use the city from props to make it semi-dynamic, fallback to Delhi
  const displayCity = city || 'Delhi';

  return (
    <div className="travel-tips-overlay">
      <div className="travel-tips-modal">
        {/* Header */}
        <div className="ttm-header">
          <div className="ttm-brand">
            <MapPin size={18} color="#ea580c" fill="#ea580c" />
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#1f2937' }}>GoYatra</span>
          </div>
          <div className="ttm-credits">
            Designed & Developed by Kanishak Gupta
          </div>
          <button className="ttm-close-btn" onClick={onClose}>
            Close <X size={16} style={{ marginLeft: '4px' }} />
          </button>
        </div>

        <div className="ttm-scrollable-content">
          <h1 className="ttm-main-title">
            GoYatra {displayCity} Travel Tips: <span>The Insider's Guide to an Unforgettable Yatra</span>
          </h1>

          {/* Section 1: Essential Tips */}
          <div className="ttm-section-header">
            <MapPin size={18} color="#ef4444" fill="#ef4444" />
            <h2>Essential {displayCity} Tips</h2>
          </div>

          <div className="ttm-essential-grid">
            <div className="ttm-tip-card ttm-packing-card">
              <h3>Packing List</h3>
              <div className="ttm-packing-icons">
                <div className="ttm-pack-item">
                  <div className="ttm-icon-box"><Shirt size={20} color="#3b82f6" /></div>
                  <span>Light<br/>clothes</span>
                </div>
                <div className="ttm-pack-item">
                  <div className="ttm-icon-box"><Footprints size={20} color="#1d4ed8" /></div>
                  <span>Comfortable<br/>shoes</span>
                </div>
                <div className="ttm-pack-item">
                  <div className="ttm-icon-box"><SunDim size={20} color="#ea580c" /></div>
                  <span>Sun<br/>hat</span>
                </div>
                <div className="ttm-pack-item">
                  <div className="ttm-icon-box"><Coffee size={20} color="#10b981" /></div>
                  <span>Reusable<br/>bottle</span>
                </div>
              </div>
            </div>

            <div className="ttm-tip-card">
              <div className="ttm-card-title"><Hand size={16} color="#d97706" /> Local Customs</div>
              <ul>
                <li>Etiquette for temples for horae</li>
                <li>Common greetings, and commendation</li>
              </ul>
            </div>

            <div className="ttm-tip-card">
              <div className="ttm-card-title"><Bus size={16} color="#ef4444" /> Transport & Navigation</div>
              <ul>
                <li>How to use the Metro</li>
                <li>Autorickshaws</li>
                <li>GoYatra app tips for your metro</li>
              </ul>
            </div>

            <div className="ttm-tip-card">
              <div className="ttm-card-title"><Sun size={16} color="#eab308" /> Dynamic, real-time tips</div>
              <ul>
                <li>Current weather is sunny. Avoid midday sun at monuments.</li>
              </ul>
            </div>
          </div>

          {/* Section 2: Curated Experiences */}
          <div className="ttm-section-header" style={{ marginTop: '2rem' }}>
            <h2>📖 Curated Experiences & Articles</h2>
            <a href="#" className="ttm-carousel-link">Carousel</a>
          </div>

          <div className="ttm-carousel-container">
            <button className="ttm-nav-btn prev"><ChevronLeft size={20} /></button>
            <div className="ttm-carousel-track">
              <div className="ttm-article-card" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1587474260580-5895781a5611?q=80&w=600)' }}>
                <div className="ttm-article-gradient"></div>
                <h3>The Top 10 Historical Monuments (and When to Beat the Crowds)</h3>
              </div>
              <div className="ttm-article-card" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600)' }}>
                <div className="ttm-article-gradient"></div>
                <h3>{displayCity}'s Ultimate Street Food Tour</h3>
              </div>
              <div className="ttm-article-card" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1555529733-0e67056058e1?q=80&w=600)' }}>
                <div className="ttm-article-gradient"></div>
                <h3>Hidden Markets You Won't Find in Guidebooks</h3>
              </div>
            </div>
            <button className="ttm-nav-btn next"><ChevronRight size={20} /></button>
          </div>

          {/* Section 3: Special Offers & GoYatra Circle */}
          <div className="ttm-section-header" style={{ marginTop: '2rem' }}>
            <h2>👑 Special Offers & GoYatra Circle Integration</h2>
          </div>

          <div className="ttm-bottom-grid">
            <div className="ttm-bottom-left">
              <div className="ttm-rewards-banner">
                <Globe size={32} color="#3b82f6" style={{ marginRight: '1rem' }} />
                <div>
                  <strong>Maximize Rewards:</strong> Use your Circle Points for experiences!
                </div>
              </div>
              
              <div className="ttm-search-box">
                <Search size={18} color="#9ca3af" style={{ marginLeft: '1rem' }} />
                <input type="text" placeholder="Search tips for: e.g., museums, best paranthas" />
              </div>
            </div>

            <div className="ttm-bottom-right">
              <div className="ttm-map-thumbnail" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600)' }}>
                 {/* Decorative map pins */}
                 <MapPin size={24} color="#ef4444" fill="#ef4444" style={{ position: 'absolute', top: '30%', left: '40%' }} />
                 <MapPin size={24} color="#3b82f6" fill="#3b82f6" style={{ position: 'absolute', top: '60%', left: '30%' }} />
                 <MapPin size={24} color="#ef4444" fill="#ef4444" style={{ position: 'absolute', top: '45%', left: '60%' }} />
                 <div className="ttm-map-label" style={{ top: '25%', left: '45%' }}>Points of Interest</div>
              </div>
            </div>
          </div>

          <div className="ttm-footer">
            <button className="ttm-explore-more-btn">Explore More Articles</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TravelTipsModal;
