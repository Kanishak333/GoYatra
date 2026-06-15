import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const About = () => {
  return (
    <div style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto', color: '#1e293b' }}>
      <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <MapPin size={36} color="#ff5a00" />
          <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>About GoYatra</h1>
        </div>
        
        <div style={{ fontSize: '1.15rem', lineHeight: 1.8, color: '#475569' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            At GoYatra, we believe that traveling with your squad should be the highlight of your year, not a logistical nightmare. 
            Founded in 2026, our mission is to fully automate and seamlessly orchestrate the group travel experience—from the first 
            spontaneous idea to the final expense split.
          </p>
          <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginTop: '3rem', marginBottom: '1rem' }}>Our Vision</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            We envision a world where planning a trip is as enjoyable as the trip itself. By leveraging advanced price forecasting, 
            intelligent itinerary generation, and integrated split-payment systems, GoYatra takes the burden of organization off 
            your shoulders so you can focus on making memories.
          </p>
          <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginTop: '3rem', marginBottom: '1rem' }}>Why Choose Us?</h2>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>Automated Planning:</strong> Instantly generate customized itineraries based on your squad's preferences.</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Fair Expense Splitting:</strong> No more awkward IOUs. Our integrated TripSplit feature handles the math.</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Smart Price Forecasting:</strong> Book at the right time. Our AI predicts flight and hotel price trends to save you money.</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Corporate & Personal:</strong> Whether it's a corporate retreat or a weekend getaway with friends, we have tailored solutions for you.</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
