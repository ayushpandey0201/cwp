import React from "react";
import { Avatar } from "@mui/material";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import "./ContactPage.css";

const ContactPage = () => {
  const developers = [
    { 
      name: "Ayush Pandey", 
      email: "ayush.pandey@example.com",
      role: "Team Leader",
      avatar: "AP",
      github: "https://github.com/Ayush7890",
      linkedin: "https://www.linkedin.com/in/ayush-pandey-455b80228/",
    },
    { 
      name: "Nitin Harsur", 
      email: "nitin@example.com",
      role: "Team Member",
      avatar: "N"
    },
    { 
      name: "Vivek Boora", 
      email: "vivek.boora@example.com",
      role: "Team Member",
      avatar: "VB"
    },
 
  ];

  // Sort developers alphabetically by name
  developers.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Meet Our Team</h1>
          <p>We're passionate about creating meaningful connections on campus</p>
        </div>

        <div className="developers-grid">
          {developers.map((developer, index) => (
            <div key={index} className="developer-card">
              {developer.role === "Team Leader" && <div className="team-leader-badge">Team Leader</div>}
              <div className="developer-avatar">
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: '#9D4EDD',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}
                >
                  {developer.avatar}
                </Avatar>
              </div>
              
              <div className="developer-info">
                <h3>{developer.name}</h3>
                <p className="developer-role">{developer.role}</p>
                <div className="developer-contact">
                  <a href={`mailto:${developer.email}`} className="contact-link">
                    <FaEnvelope />
                    <span>{developer.email}</span>
                  </a>
                </div>
              </div>

              <div className="developer-social">
                <a href={developer.github} target="_blank" rel="noopener noreferrer" className="social-btn github">
                  <FaGithub />
                </a>
                <a href={developer.linkedin} target="_blank" rel="noopener noreferrer" className="social-btn linkedin">
                  <FaLinkedin />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="contact-footer">
          <div className="footer-content">
            <h3>Get in Touch</h3>
            <p>
              Have questions, suggestions, or want to contribute? We'd love to hear from you!
              Our team is always open to feedback and collaboration.
            </p>
            <div className="footer-features">
              <div className="footer-feature">
                <span className="feature-icon">💬</span>
                <span>Open Communication</span>
              </div>
              <div className="footer-feature">
                <span className="feature-icon">🚀</span>
                <span>Continuous Improvement</span>
              </div>
              <div className="footer-feature">
                <span className="feature-icon">🤝</span>
                <span>Community Driven</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
