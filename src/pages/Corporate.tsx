import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  CheckCircle, 
  UserCheck, 
  Briefcase, 
  FileEdit,
  Sliders,
  PlaneTakeoff,
  User,
  Share2,
  Clock
} from 'lucide-react';
import '../index.css';

const Corporate = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const testimonials = [
    {
      quote: "I can't thank GoYatra Corporate enough for simplifying our company's travel booking process. From the intuitive interface to the excellent support, it's a game-changer!",
      author: "Sarah Jenkins, Travel Manager"
    },
    {
      quote: "The centralized dashboard makes expense reporting a breeze. We have reduced our travel overhead by 20% simply by enforcing the policies natively available on this platform.",
      author: "Michael Chen, Finance Director"
    },
    {
      quote: "As someone who flies almost every week, having all my itineraries, boarding passes, and corporate discounts in one single portal is incredibly relieving.",
      author: "Priya Sharma, Sales Executive"
    }
  ];

  return (
    <div className="corporate-page">
      {/* Hero Section */}
      <section className="corp-hero-section">
        <div className="corp-hero-overlay"></div>
        <div className="corp-hero-content">
          <div className="corp-hero-text animate-fade-in">
            <h1>Start Seamless Business Journeys With <br/><span className="highlight-corp">GOYATRA CORPORATE</span></h1>
            <p>Your all-in-one platform offering specialised travel solutions for ultimate travel experiences</p>
          </div>
          
          <div className="corp-video-card-container animate-fade-in delay-200">
            <div className="corp-video-card">
              <div className="cvc-header">
                <div className="cvc-logo-placeholder">G</div>
                <div className="cvc-header-text">
                  <h4>Simplify Business Travel with GoYatra</h4>
                  <p>GoYatra Corporate</p>
                </div>
              </div>
              
              <div className="cvc-body">
                <h3>GOYATRA CORPORATE</h3>
                <p>Elevating Corporate Travel Management</p>
                <button className="play-button">
                  <Play size={24} fill="white" />
                </button>
              </div>
              
              <div className="cvc-footer">
                <div className="cvc-actions">
                  <button><Share2 size={16} /></button>
                  <button><Clock size={16} /></button>
                </div>
                <button className="watch-youtube">Watch on <span>YouTube</span></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Single Place For Every Employee */}
      <section className="corp-features-section">
        <div className="corp-section-header">
          <h2>Single Place For Every <span>Employee</span></h2>
          <p>Every exclusive feature has been specially designed to meet every employee's requirements.</p>
        </div>
        
        <div className="corp-feature-grid">
          {/* Feature 1 */}
          <motion.div className="corp-feature-card" whileHover={{ y: -5 }}>
            <div className="cfc-icon-box">
              <UserCheck size={32} color="#059669" />
            </div>
            <h3>Travel Managers</h3>
            <p className="cfc-subtitle">Responsible for strategizing business travel plans</p>
            <ul className="cfc-list">
              <li><CheckCircle size={14} className="check-icon"/> Easy-to-manage admin panel with in-depth analysis of the budget.</li>
              <li><CheckCircle size={14} className="check-icon"/> In-house tracking solutions to get regular employee details.</li>
              <li><CheckCircle size={14} className="check-icon"/> 24/7 reliable support for resolving all the queries.</li>
            </ul>
          </motion.div>

          {/* Feature 2 */}
          <motion.div className="corp-feature-card" whileHover={{ y: -5 }}>
            <div className="cfc-icon-box">
              <Briefcase size={32} color="#059669" />
            </div>
            <h3>Travel Arranger</h3>
            <p className="cfc-subtitle">Those who oversee the company's travel expenditure</p>
            <ul className="cfc-list">
              <li><CheckCircle size={14} className="check-icon"/> User-friendly admin portal managing all employees' travel expenses</li>
              <li><CheckCircle size={14} className="check-icon"/> Maintains and audits accurate records of travel arrangements</li>
              <li><CheckCircle size={14} className="check-icon"/> Create and analyse travel expense reports to optimise future tours.</li>
            </ul>
          </motion.div>

          {/* Feature 3 */}
          <motion.div className="corp-feature-card" whileHover={{ y: -5 }}>
            <div className="cfc-icon-box">
              <User size={32} color="#059669" />
            </div>
            <h3>Employees</h3>
            <p className="cfc-subtitle">Those who travel to sky-rocket the business.</p>
            <ul className="cfc-list">
              <li><CheckCircle size={14} className="check-icon"/> Special discounts on travel-related expenses</li>
              <li><CheckCircle size={14} className="check-icon"/> A centralised booking system enabling easier coordination.</li>
              <li><CheckCircle size={14} className="check-icon"/> Access to top-notch flights and luxurious hotels at negotiated prices.</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Booking Procedure Section */}
      <section className="corp-procedure-section">
        <div className="corp-procedure-overlay"></div>
        <div className="corp-section-header light-text" style={{ position: 'relative', zIndex: 2 }}>
          <h2>Smart, Steady & Smooth <span>Booking Procedure!</span></h2>
          <p>Just follow these simple steps to begin your corporate journey.</p>
        </div>
        
        <div className="corp-timeline" style={{ position: 'relative', zIndex: 2 }}>
          <div className="timeline-step">
            <div className="step-number">01</div>
            <div className="step-icon-box">
              <FileEdit size={40} color="white" />
            </div>
            <h3>Create Your Account</h3>
            <p>Enter the required details regarding your company, including employee size.</p>
          </div>
          
          <div className="timeline-step">
            <div className="step-number">02</div>
            <div className="step-icon-box">
              <Sliders size={40} color="white" />
            </div>
            <h3>Review & Set Policies</h3>
            <p>Preview all the facilities and choose them as per your preference.</p>
          </div>
          
          <div className="timeline-step">
            <div className="step-number">03</div>
            <div className="step-icon-box">
              <PlaneTakeoff size={40} color="white" />
            </div>
            <h3>Get Set Go</h3>
            <p>Invite your team players to GOYATRA CORPORATE for making the entire journey blissful.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="corp-testimonials-section">
        <div className="corp-section-header">
          <h2>Business Travellers <span>Love Us</span></h2>
        </div>
        
        <div className="corp-testimonial-grid">
          {testimonials.map((item, idx) => (
            <motion.div key={idx} className="corp-testimonial-card" whileHover={{ y: -5 }}>
              <div className="ctc-avatar">
                <User size={32} color="#1e293b" />
              </div>
              <p className="ctc-quote">"{item.quote}"</p>
              <div className="ctc-author">- {item.author}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Corporate;
