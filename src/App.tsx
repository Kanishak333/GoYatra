import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  User,
  Briefcase,
  Headphones,
  Ticket
} from 'lucide-react';
import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from './config/firebase';
import { FiLinkedin, FiInstagram, FiGithub, FiTwitter } from 'react-icons/fi';
import Home from './pages/Home';
import PlanTrip from './pages/PlanTrip';
import PriceForecaster from './pages/PriceForecaster';
import TripSplit from './pages/TripSplit';
import Rides from './pages/Rides';
import Food from './pages/Food';
import Dashboard from './pages/Dashboard';
import Corporate from './pages/Corporate';
import SaathiChatbot from './components/SaathiChatbot';
import './index.css';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loginInput, setLoginInput] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      setShowAuthModal(false);
    } catch (error) {
      console.error("Error signing in with Google", error);
      alert("Failed to sign in with Google. Please check your configuration.");
    }
  };

  return (
    <div className={`app-container ${isHome ? 'home-bg' : ''}`}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo">
          <div className="logo-icon">
            <MapPin size={24} color="white" fill="#ff5a00" strokeWidth={1} />
            <span className="logo-g">G</span>
          </div>
          <span className="logo-text">GoYatra</span>
        </div>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
          <NavLink to="/plan-trip" className={({ isActive }) => (isActive ? 'active' : '')}>Plan Trip</NavLink>
          <NavLink to="/price-forecaster" className={({ isActive }) => (isActive ? 'active' : '')}>Price Forecaster</NavLink>
          <NavLink to="/trip-split" className={({ isActive }) => (isActive ? 'active' : '')}>TripSplit</NavLink>
          <NavLink to="/rides" className={({ isActive }) => (isActive ? 'active' : '')}>Rides</NavLink>
          <NavLink to="/food" className={({ isActive }) => (isActive ? 'active' : '')}>Food</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>Dashboard</NavLink>
        </div>
        <div className="nav-actions" style={{ position: 'relative' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '0.4rem 1rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', lineHeight: '1' }}>{user.displayName?.split(' ')[0] || 'User'}</span>
                <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Logged In</span>
              </div>
            </div>
          ) : (
            <button 
              className="login-signup-btn"
              onClick={() => setIsLoginOpen(!isLoginOpen)}
            >
              Login or Signup
            </button>
          )}
          
          {isLoginOpen && (
            <div className="login-dropdown">
              <div className="login-option" onClick={() => {
                setShowAuthModal(true);
                setIsLoginOpen(false);
              }}>
                <div className="login-icon-box">
                  <User size={24} color="#3b82f6" />
                </div>
                <div className="login-text-box">
                  <h4>Customer Login</h4>
                  <p>Login & check bookings</p>
                </div>
              </div>
              <div className="login-option" onClick={() => {
                navigate('/corporate');
                setIsLoginOpen(false);
              }}>
                <div className="login-icon-box">
                  <Briefcase size={24} color="#3b82f6" />
                </div>
                <div className="login-text-box">
                  <h4>Corporate Travel</h4>
                  <p>Login corporate account</p>
                </div>
              </div>
              <div className="login-option">
                <div className="login-icon-box">
                  <Headphones size={24} color="#3b82f6" />
                </div>
                <div className="login-text-box">
                  <h4>Agent Login</h4>
                  <p>Login your agent account</p>
                </div>
              </div>
              <div className="login-option">
                <div className="login-icon-box">
                  <Ticket size={24} color="#3b82f6" />
                </div>
                <div className="login-text-box">
                  <h4>My Booking</h4>
                  <p>Manage your bookings here</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Designer Banner */}
      <div className="designer-banner">
        Designed & Developed by Kanishak Gupta
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plan-trip" element={<PlanTrip />} />
        <Route path="/price-forecaster" element={<PriceForecaster />} />
        <Route path="/trip-split" element={<TripSplit />} />
        <Route path="/rides" element={<Rides />} />
        <Route path="/food" element={<Food />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/corporate" element={<Corporate />} />
      </Routes>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <button className="auth-close-btn" onClick={() => setShowAuthModal(false)}>✕</button>
            <div className="auth-banner">
              <div className="auth-banner-text">
                <p>First-Time User Offer!</p>
                <h3>Grab Up to <span>20% OFF*</span><br/>on Your 1st Travel Bookings</h3>
              </div>
            </div>
            <div className="auth-content">
              <h2>Login or Create an account</h2>
              <input 
                type="text" 
                placeholder="Email ID or Mobile Number" 
                className="auth-input" 
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
              />
              <button 
                className={`auth-continue-btn ${loginInput.trim().length > 4 ? 'active' : ''}`}
                onClick={() => {
                  if (loginInput.trim().length > 4) {
                    alert("Traditional email login is not yet configured. Please click the Google button below to sign in securely!");
                  }
                }}
              >
                Continue
              </button>
              
              <div className="auth-divider">
                <span>Or Login Via</span>
              </div>
              
              <div className="auth-socials">
                <button className="social-btn" onClick={handleGoogleSignIn}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" width="20" />
                  Google
                </button>
                <button className="social-btn">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" width="20" />
                  Facebook
                </button>
              </div>
              
              <p className="auth-terms">
                By logging in, I understand & agree to GoYatra <a href="#">terms of use</a> and <a href="#">privacy policy</a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="logo-icon" style={{ marginBottom: 0 }}>
                <MapPin size={24} color="white" fill="#ff5a00" strokeWidth={1} />
                <span className="logo-g">G</span>
              </div>
              <span className="logo-text" style={{ marginBottom: 0, display: 'inline-block' }}>GoYatra</span>
            </div>
            <p className="footer-desc">Your ultimate squad trip, fully automated. Plan trips easily, forecast prices, and split bills without the drama.</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Contact</a>
              <a href="#">Careers</a>
            </div>
            <div className="link-group">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="#"><FiLinkedin size={20} /></a>
              <a href="#"><FiInstagram size={20} /></a>
              <a href="#"><FiGithub size={20} /></a>
              <a href="#"><FiTwitter size={20} /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} GoYatra. All rights reserved.
        </div>
      </footer>

      {/* Floating Chat Icon / Chatbot */}
      <SaathiChatbot />
    </div>
  );
}

export default App;
