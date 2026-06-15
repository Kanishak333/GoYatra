import { motion } from 'framer-motion';

const Terms = () => {
  return (
    <div style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto', color: '#1e293b' }}>
      <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>Terms of Service</h1>
        <p style={{ color: '#64748b', marginBottom: '3rem' }}>Last Updated: May 2026</p>

        <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#475569', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section>
            <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '1rem' }}>1. Acceptance of Terms</h2>
            <p>
              By accessing and using GoYatra's website, applications, and services, you accept and agree to be bound by the terms and 
              provisions of this agreement.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '1rem' }}>2. Use of Services</h2>
            <p>
              You agree to use our services only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit 
              anyone else's use and enjoyment of GoYatra. Prohibited behavior includes harassing or causing distress or inconvenience to any person, 
              transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our services.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '1rem' }}>3. Booking and Payments</h2>
            <p>
              When you make a booking through GoYatra, you agree to pay the stated price, including any applicable taxes and fees. 
              Our TripSplit feature facilitates group payments; however, the primary booker remains ultimately responsible for the full payment 
              should any group member fail to pay their share.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '1rem' }}>4. Cancellations and Refunds</h2>
            <p>
              Cancellation policies vary by airline, hotel, and service provider. Please review the specific cancellation policy presented 
              to you during the booking process. GoYatra's service fees are non-refundable.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default Terms;
