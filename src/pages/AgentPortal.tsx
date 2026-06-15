import React from 'react';
import { 
  MapPin, 
  MousePointerClick, 
  MonitorSmartphone, 
  FileCheck, 
  CheckCircle,
  Percent,
  Presentation,
  Megaphone,
  Headphones,
  Luggage,
  Target,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './AgentPortal.css';

interface AgentPortalProps {
  onOpenAuth?: (type: 'login' | 'signup') => void;
}

const AgentPortal: React.FC<AgentPortalProps> = ({ onOpenAuth }) => {
  return (
    <div className="agent-portal-container">
      {/* Hero Section */}
      <section className="agent-hero">
        <div className="agent-hero-nav">
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            <div className="agent-logo">
              <MapPin size={32} color="white" fill="#ff5a00" strokeWidth={1} />
              <span style={{ color: 'white' }}>GoYatra <span style={{ fontWeight: 400, opacity: 0.8 }}>Agent</span></span>
            </div>
          </Link>
          <button className="agent-btn" onClick={() => onOpenAuth?.('signup')}>Sign In/ Sign Up</button>
        </div>

        <div className="agent-hero-content">
          <div className="hero-accent-line"></div>
          <h1>Grow your Travel Business with <span>GoYatra</span></h1>
          <p>
            GoYatra welcomes you to a new platform specifically created to manage the travel requirements of your valued customers. Experience seamless bookings, great commissions, and 24/7 support.
          </p>
        </div>
      </section>

      {/* Overlapping Banner */}
      <div className="agent-banner-container">
        <div className="agent-banner">
          <div className="agent-banner-top">
            <div className="banner-left">
              <h2>BEST <span>DISCOUNTED</span> Hotel Rates</h2>
            </div>
            <div className="banner-right">
              <p>Now Available on <span style={{fontWeight: 800}}>GoYatra</span> Agent</p>
              <button className="banner-btn" onClick={() => onOpenAuth?.('login')}>
                Login Today! <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="agent-banner-bottom">
            <span>Best Hotel Deals</span>
            <span>Highly Competitive Prices</span>
            <span>2.9 Million+ Hotels</span>
            <span>Globally Wide Inventory</span>
            <span>Seamless Booking</span>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>

      <div className="airline-deals">
        <h2>Exclusive Deals & Special Fares On Top International Airlines</h2>
      </div>

      {/* Procedures */}
      <section className="agent-procedures">
        <div className="procedures-grid">
          <div className="procedure-card">
            <div className="proc-icon-wrap">
              <MousePointerClick size={48} strokeWidth={1.5} />
            </div>
            <h3>Effortless Procedures</h3>
            <p>The platform is convenient and hassle-free for making bookings and keeping payment records.</p>
          </div>
          <div className="procedure-card">
            <div className="proc-icon-wrap">
              <MonitorSmartphone size={48} strokeWidth={1.5} />
            </div>
            <h3>Easy Modifications</h3>
            <p>You can easily make modifications post booking without any complicated processes.</p>
          </div>
          <div className="procedure-card">
            <div className="proc-icon-wrap">
              <FileCheck size={48} strokeWidth={1.5} />
            </div>
            <h3>Flexible Policies</h3>
            <p>You can enjoy easy and flexible cancellation policies on your travel bookings.</p>
          </div>
        </div>
      </section>

      {/* Exclusive Facilities */}
      <section className="agent-facilities">
        <div className="fac-left-img"></div>
        <div className="fac-right-content">
          <h2>Explore Our <span>Exclusive Facilities</span></h2>
          <div className="fac-list">
            <div className="fac-item">
              <CheckCircle size={24} className="fac-check" />
              <div>
                <h4>Exclusive WhiteLabel Solutions</h4>
                <p>Get premium access to specially designed products and services at competitive prices.</p>
              </div>
            </div>
            <div className="fac-item">
              <CheckCircle size={24} className="fac-check" />
              <div>
                <h4>Advanced Technological APIs</h4>
                <p>Streamline your entire business operations with our fully integrated technological APIs.</p>
              </div>
            </div>
            <div className="fac-item">
              <CheckCircle size={24} className="fac-check" />
              <div>
                <h4>Optimized Control Panel</h4>
                <p>Track travel bookings seamlessly to enhance the company's overall efficiency.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Choice */}
      <section className="agent-best-choice">
        <div className="bc-left">
          <h2>What Makes Us The<br/><span>Best Choice?</span></h2>
          
          <div className="bc-grid">
            <div className="bc-item">
              <Percent size={32} strokeWidth={1.5} className="bc-icon" />
              <h4>Best commission structure</h4>
              <p>on all transactions and bookings</p>
            </div>
            <div className="bc-item">
              <Presentation size={32} strokeWidth={1.5} className="bc-icon" />
              <h4>Live training</h4>
              <p>and assistance on products</p>
            </div>
            <div className="bc-item">
              <Megaphone size={32} strokeWidth={1.5} className="bc-icon" />
              <h4>Regular Marketing</h4>
              <p>and credit support to scale up your business</p>
            </div>
            <div className="bc-item">
              <Headphones size={32} strokeWidth={1.5} className="bc-icon" />
              <h4>24*7 Dedicated Support Center</h4>
              <p>for resolving your query</p>
            </div>
            <div className="bc-item">
              <Luggage size={32} strokeWidth={1.5} className="bc-icon" />
              <h4>Wide Range of Offerings</h4>
              <p>Including Flights, Cabs, Trains, Hotels, Cruises, Charters and Trains</p>
            </div>
            <div className="bc-item">
              <Target size={32} strokeWidth={1.5} className="bc-icon" />
              <h4>Lead Generation</h4>
              <p>for your market segment</p>
            </div>
          </div>
        </div>
        
        <div className="bc-right">
          <img src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=80" alt="Business discussion" className="bc-img-bg" />
          <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80" alt="Team handshake" className="bc-img-fg" />
        </div>
      </section>

      {/* Footer CTA */}
      <section className="agent-footer-cta">
        <h2>Start Today, Become GoYatra Partner And Bring Your Business To <span>New Heights</span></h2>
        <button className="agent-btn" style={{ fontSize: '1.1rem', padding: '0.8rem 2.5rem' }} onClick={() => onOpenAuth?.('signup')}>Sign In/ Sign Up</button>
      </section>
      
      <div className="agent-footer-bottom">
        Copyright © {new Date().getFullYear()} GoYatra Agent Portal. All Rights Reserved.
      </div>
    </div>
  );
};

export default AgentPortal;
