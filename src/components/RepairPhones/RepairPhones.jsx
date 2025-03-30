import React, { useState } from 'react';
import './Repair.css'
import repair from "../../assets/repair.jpeg"
import repair2 from "../../assets/repair2.jpg"
import repair3 from "../../assets/repair3.jpeg"
import repair4 from "../../assets/repair4.jpeg"
import bannerrepair from "../../assets/repairbanner.jpeg"
const RepairPhones = () => {
    const [selectedService, setSelectedService] = useState(null);

    const repairServices = [
        {
          id: 1,
          name: "Screen Replacement",
          description: "Fix cracked or damaged screens with high-quality replacement parts. Compatible with all major phone brands.",
          price: "Starting at $79",
          estimatedTime: "1-2 hours",
          image: repair
        },
        {
          id: 2,
          name: "Battery Replacement",
          description: "Restore your phone's battery life with our professional battery replacement service.",
          price: "Starting at $49",
          estimatedTime: "30-60 minutes",
          image: repair2
        },
        {
          id: 3,
          name: "Water Damage Repair",
          description: "Specialized treatment for water-damaged phones. Quick response increases chances of recovery.",
          price: "Starting at $99",
          estimatedTime: "24-48 hours",
          image: repair3
        },
        {
          id: 4,
          name: "Charging Port Repair",
          description: "Fix loose or non-functioning charging ports to restore normal charging capabilities.",
          price: "Starting at $59",
          estimatedTime: "1-2 hours",
          image: repair4
        }
      ];
    
      return (
        <div className="Repair-phone container">
      <header className="Repair-phone header">
        <h1 className="Repair-phone title">Professional Phone Repair Services</h1>
        <p className="Repair-phone subtitle">Fast, reliable repairs for all phone brands and models</p>
      </header>

      {/* Hero Section */}
      <div className="Repair-phone repair-hero">
        <div className="Repair-phone repair-hero-content">
          <h2 className="Repair-phone repair-hero-title">Expert Phone Repairs</h2>
          <p className="Repair-phone repair-hero-text">
            Our certified technicians can fix almost any phone issue with same-day service for most repairs.
          </p>
          <button className="Repair-phone repair-cta-button">
            Schedule a Repair
          </button>
        </div>
        <div className="Repair-phone repair-hero-image-container">
          <img src={bannerrepair} alt="Phone repair technician" className="Repair-phone repair-hero-image" />
        </div>
      </div>

      {/* Services Section */}
      <section className="Repair-phone repair-services-section">
        <h2 className="Repair-phone section-title">Our Repair Services</h2>
        
        <div className="Repair-phone repair-services-grid">
          {repairServices.map((service) => (
            <div key={service.id} className="Repair-phone repair-service-card">
              <div className="Repair-phone repair-service-image-container">
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="Repair-phone repair-service-image"
                />
              </div>
              <div className="Repair-phone repair-service-details">
                <h3 className="Repair-phone repair-service-name">{service.name}</h3>
                <p className="Repair-phone repair-service-description">{service.description}</p>
                <div className="Repair-phone repair-service-info">
                  <p className="Repair-phone repair-service-price">{service.price}</p>
                  <p className="Repair-phone repair-service-time">
                    <span className="Repair-phone repair-time-icon">⏱</span> {service.estimatedTime}
                  </p>
                </div>
                <button className="Repair-phone repair-service-button">
                  Book This Service
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="Repair-phone repair-process-section">
        <h2 className="Repair-phone section-title">Our Repair Process</h2>
        <div className="Repair-phone repair-process-steps">
          <div className="Repair-phone repair-step">
            <div className="Repair-phone repair-step-number">1</div>
            <div className="Repair-phone repair-step-content">
              <h3 className="Repair-phone repair-step-title">Diagnosis</h3>
              <p className="Repair-phone repair-step-description">
                Our technicians will thoroughly examine your device and provide a detailed assessment of the issues.
              </p>
            </div>
          </div>
          <div className="Repair-phone repair-step">
            <div className="Repair-phone repair-step-number">2</div>
            <div className="Repair-phone repair-step-content">
              <h3 className="Repair-phone repair-step-title">Quote</h3>
              <p className="Repair-phone repair-step-description">
                We'll provide a transparent, no-obligation price quote before beginning any work.
              </p>
            </div>
          </div>
          <div className="Repair-phone repair-step">
            <div className="Repair-phone repair-step-number">3</div>
            <div className="Repair-phone repair-step-content">
              <h3 className="Repair-phone repair-step-title">Repair</h3>
              <p className="Repair-phone repair-step-description">
                Our skilled technicians use high-quality parts to repair your device quickly and effectively.
              </p>
            </div>
          </div>
          <div className="Repair-phone repair-step">
            <div className="Repair-phone repair-step-number">4</div>
            <div className="Repair-phone repair-step-content">
              <h3 className="Repair-phone repair-step-title">Quality Check</h3>
              <p className="Repair-phone repair-step-description">
                We thoroughly test your device to ensure everything is working perfectly before returning it to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Warranty Section */}
      <section className="Repair-phone cta-section">
        <h2 className="Repair-phone cta-title">Our Repairs Are Guaranteed</h2>
        <p className="Repair-phone cta-text">All repairs come with a 90-day warranty on parts and service</p>
        <button className="Repair-phone cta-button">
          Contact Us Today
        </button>
      </section>

      {/* Testimonials */}
      <section className="Repair-phone testimonials-section">
        <h2 className="Repair-phone section-title">What Our Customers Say</h2>
        <div className="Repair-phone testimonials-grid">
          <div className="Repair-phone testimonial-card">
            <div className="Repair-phone testimonial-rating">★★★★★</div>
            <p className="Repair-phone testimonial-text">
              "They fixed my cracked screen in under an hour. Excellent service and very reasonable prices!"
            </p>
            <p className="Repair-phone testimonial-author">- Sarah M.</p>
          </div>
          <div className="Repair-phone testimonial-card">
            <div className="Repair-phone testimonial-rating">★★★★★</div>
            <p className="Repair-phone testimonial-text">
              "My phone wouldn't charge at all. They replaced the charging port and now it works like new."
            </p>
            <p className="Repair-phone testimonial-author">- Michael T.</p>
          </div>
          <div className="Repair-phone testimonial-card">
            <div className="Repair-phone testimonial-rating">★★★★★</div>
            <p className="Repair-phone testimonial-text">
              "Dropped my phone in water and thought it was gone for good. These guys saved all my data!"
            </p>
            <p className="Repair-phone testimonial-author">- Jessica K.</p>
          </div>
        </div>
      </section>
    </div>
      );
    };

    export default RepairPhones;
  