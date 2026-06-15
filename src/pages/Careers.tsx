import { motion } from 'framer-motion';
import { Briefcase, Users, Zap, Globe, MapPin } from 'lucide-react';

const Careers = () => {
  const openRoles = [
    { title: "Senior Frontend Engineer", dept: "Engineering", location: "Remote / Noida" },
    { title: "Product Manager, Travel Logistics", dept: "Product", location: "Noida" },
    { title: "Data Scientist (Pricing Algorithms)", dept: "Data", location: "Remote" },
    { title: "Customer Success Specialist", dept: "Support", location: "Remote" }
  ];

  return (
    <div style={{ padding: '6rem 2rem', maxWidth: '900px', margin: '0 auto', color: '#1e293b' }}>
      <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>Join the GoYatra Team</h1>
        <p style={{ fontSize: '1.25rem', color: '#64748b', marginBottom: '4rem', maxWidth: '700px' }}>
          We are revolutionizing the way groups and corporations travel. Help us build the ultimate automated travel ecosystem.
        </p>

        <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '2rem' }}>Why Work With Us?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <div style={{ padding: '1.5rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <Zap size={28} color="#ff5a00" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Fast-Paced Innovation</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Work with cutting-edge AI for price forecasting and routing.</p>
          </div>
          <div style={{ padding: '1.5rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <Globe size={28} color="#3b82f6" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Work Anywhere</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>We support remote work and flexible hours across multiple time zones.</p>
          </div>
          <div style={{ padding: '1.5rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <Users size={28} color="#10b981" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Inclusive Culture</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Join a diverse, global team that values every perspective.</p>
          </div>
        </div>

        <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '2rem' }}>Open Positions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {openRoles.map((role, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' }} className="career-card">
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.25rem' }}>{role.title}</h3>
                <div style={{ display: 'flex', gap: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
                  <span><Briefcase size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }}/> {role.dept}</span>
                  <span><MapPin size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }}/> {role.location}</span>
                </div>
              </div>
              <button style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 600 }}>Apply</button>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '2rem', color: '#64748b', textAlign: 'center' }}>Don't see a role that fits? Email your resume to <strong>careers@goyatra.com</strong></p>
      </motion.div>
    </div>
  );
};

export default Careers;
