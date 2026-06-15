import { motion } from 'framer-motion';

const Cookies = () => {
  return (
    <div style={{ padding: '6rem 2rem', maxWidth: '800px', margin: '0 auto', color: '#1e293b' }}>
      <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>Cookie Policy</h1>
        <p style={{ color: '#64748b', marginBottom: '3rem' }}>Last Updated: May 2026</p>

        <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#475569', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section>
            <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '1rem' }}>What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
              They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '1rem' }}>How We Use Cookies</h2>
            <p>
              We use cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate 
              (these are referred to as "essential" or "strictly necessary" cookies). Other cookies enable us to track and target the interests 
              of our users to enhance the experience on our properties.
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>Essential Cookies:</strong> Necessary to provide you with services available through our website and to use some of its features, such as access to secure areas.</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Performance Cookies:</strong> Used to enhance the performance and functionality of our website but are non-essential to their use.</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Analytics Cookies:</strong> Collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '1rem' }}>Managing Cookies</h2>
            <p>
              You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. 
              If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default Cookies;
