import React from 'react'
import './AboutUs.css';

const AboutUs = () => {
  return (
    <>
        <section className="aboutUs-container">
        <div className="aboutUs-header">
            <h1>About Us</h1>
        </div>
        <div className="aboutUs-content">
            <p>Welcome to TechStore, your number one source for the latest and greatest in technology. We specialize in mobile phones, laptops, phone cases, headphones, earpods, and watches.</p>
            <p>At TechStore, we are committed to providing top-quality products at competitive prices, ensuring a seamless shopping experience for our customers. Our mission is to bring you the best in technology while offering exceptional customer service.</p>
            <p>Founded with passion, TechStore has grown from a small business into a trusted name in the tech industry. We take pride in our dedication to innovation, customer satisfaction, and fast, reliable delivery.</p>
            <p>Thank you for choosing TechStore. We look forward to serving you!</p>
        </div>
        <div className="aboutUs-vision">
            <h2>Our Vision</h2>
            <p>We envision a world where technology enhances everyday life, connecting people and empowering them to achieve more. TechStore strives to be at the forefront of this revolution, bringing cutting-edge technology to our customers.</p>
        </div>
        <div className="aboutUs-mission">
            <h2>Our Mission</h2>
            <p>Our mission is to provide high-quality and affordable technology solutions that cater to the needs of both individuals and businesses. We aim to make shopping for tech products easy, convenient, and enjoyable.</p>
        </div>
        <div className="aboutUs-values">
            <h2>Our Values</h2>
            <ul>
                <li><strong>Quality:</strong> We ensure that every product meets high standards before reaching our customers.</li>
                <li><strong>Innovation:</strong> We stay ahead of trends to bring the latest technology to your doorstep.</li>
                <li><strong>Customer Satisfaction:</strong> Your satisfaction is our priority. We offer excellent support and hassle-free shopping experiences.</li>
                <li><strong>Integrity:</strong> We believe in transparency, honesty, and ethical business practices.</li>
            </ul>
        </div>
        <div className="aboutUs-contact">
            <h2>Contact Us</h2>
            <p>If you have any questions or need assistance, feel free to reach out to us at <a href="mailto:support@techstore.com">support@techstore.com</a>. You can also follow us on our social media channels for updates and special offers.</p>
        </div>
    </section>
    </>
  )
}

export default AboutUs
