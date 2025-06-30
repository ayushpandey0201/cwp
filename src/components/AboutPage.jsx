import React from 'react';
import './ContactPage.css'; // Reuse styles for consistency

const AboutPage = () => (
  <div className="contact-page">
    <div className="contact-container">
      <div className="contact-header">
        <h1>About Campus Connect</h1>
        <p>
          Campus Connect is an anonymous chat platform designed to foster open, honest, and supportive communication within your campus community. Our mission is to help students connect, share, and support each other in a safe and inclusive environment.
        </p>
      </div>
      <div style={{ margin: '40px 0', color: '#C0C0C0', textAlign: 'center' }}>
        <h2 style={{ color: '#9D4EDD' }}>Why Campus Connect?</h2>
        <ul style={{ listStyle: 'none', padding: 0, fontSize: '18px' }}>
          <li>🔒 100% Anonymous & Secure</li>
          <li>🎓 Campus-Only Community</li>
          <li>💬 Real-Time Chat & Support</li>
          <li>🤝 Built by students, for students</li>
        </ul>
      </div>
      <div className="contact-footer">
        <div className="footer-content">
          <h3>Meet the Team</h3>
          <p>
            Campus Connect is developed and maintained by passionate students who believe in the power of community and open communication. We are always open to feedback and collaboration!
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default AboutPage; 