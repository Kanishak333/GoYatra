import { motion } from 'framer-motion';

const Privacy = () => {
  return (
    <div style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto', color: '#1e293b' }}>
      <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>Privacy Policy</h1>
        <p style={{ color: '#64748b', marginBottom: '3rem' }}>Last Updated: May 2026</p>

        <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#475569', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section>
            <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '1rem' }}>1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when you create an account, plan a trip, or interact with our services. 
              This includes your name, email address, payment information, and travel preferences.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '1rem' }}>2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services. This includes processing transactions, 
              sending booking confirmations, offering personalized travel recommendations, and communicating with you about your account.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '1rem' }}>3. Information Sharing</h2>
            <p>
              We may share your information with third-party vendors and service providers (such as airlines, hotels, and payment processors) 
              who need access to such information to carry out work on our behalf or facilitate your travel arrangements. We do not sell your personal data.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '1rem' }}>4. Data Security</h2>
            <p>
              GoYatra takes reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, 
              disclosure, alteration, and destruction. All payment information is encrypted using secure socket layer technology (SSL).
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '1rem' }}>5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@goyatra.com.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default Privacy;
