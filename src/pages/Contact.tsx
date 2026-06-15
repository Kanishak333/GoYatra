import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto', color: '#1e293b' }}>
      <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>Contact Us</h1>
        <p style={{ fontSize: '1.15rem', color: '#64748b', marginBottom: '3rem' }}>
          We're here to help! Whether you have a question about your booking, need help planning a squad trip, or want to explore corporate partnerships, our team is ready to assist.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <Phone size={28} color="#3b82f6" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#0f172a' }}>Call Us</h3>
            <p style={{ color: '#475569', marginBottom: '0.5rem' }}>+91 1800-123-4567</p>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Mon-Fri from 9am to 6pm IST</p>
          </div>
          <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <Mail size={28} color="#ff5a00" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#0f172a' }}>Email Us</h3>
            <p style={{ color: '#475569', marginBottom: '0.5rem' }}>support@goyatra.com</p>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>We'll respond within 24 hours.</p>
          </div>
          <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <MapPin size={28} color="#10b981" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#0f172a' }}>Visit Us</h3>
            <p style={{ color: '#475569', marginBottom: '0.5rem' }}>GoYatra Headquarters</p>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Sector 62, Noida, India</p>
          </div>
        </div>

        <div style={{ background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '2rem' }}>Send a Message</h2>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={(e) => e.preventDefault()}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <input type="text" placeholder="First Name" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem' }} />
              <input type="text" placeholder="Last Name" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem' }} />
            </div>
            <input type="email" placeholder="Email Address" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem' }} />
            <textarea placeholder="How can we help?" rows={5} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', resize: 'vertical' }}></textarea>
            <button style={{ background: '#ff5a00', color: 'white', padding: '1rem 2rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 600, border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}>Submit Request</button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
