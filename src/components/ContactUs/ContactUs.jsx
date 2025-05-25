import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram  } from "react-icons/fa";
import './ContactUs.css'

const ContactUs = () => {
  return (
    <div className="Contact-us">
      <div className="Contact-us-contact-container">
        <div className="Contact-us-contact-info">
            <h2>Get in touch</h2>
            <p><strong>Visit us</strong>67 Wisteria Way, Croydon South, VIC 3136 AU</p>

            <p><strong>Chat to us</strong>Our friendly team is here to help.
            <a href="mailto:mizanmobile@gmail.com">mizanmobile@gmail.com</a></p>

            <p><strong>Call us</strong>Mon-Fri from 8am to 5pm
            <a href="tel:+995555555555">(+995) 555-55-55-55</a></p>

            <p><strong>Social media</strong></p>
            <div className="Contact-us-social-icons">
                <a href="https://facebook.com/mizanmobile" target="_blank" rel="noopener noreferrer"><FaFacebook/></a>
                <a href="https://instagram.com/mizanmobile" target="_blank" rel="noopener noreferrer"><FaInstagram/></a>
                <a href="https://twitter.com/mizanmobile" target="_blank" rel="noopener noreferrer"><FaTwitter/></a>
            </div>
        </div>

        <div className="Contact-us-contact-form">
            <form action="#" method="POST">
                <div className="Contact-us-form-group">
                    <input type="text" name="first-name" placeholder="First Name" required/>
                    <input type="text" name="last-name" placeholder="Last Name" required/>
                </div>
                <input type="email" name="email" placeholder="Email" required/>
                <input type="tel" name="phone" placeholder="Phone Number"/>
                <textarea name="message" placeholder="Tell us what we can help you with"></textarea>

                <label className="Contact-us-checkbox">
                    <input type="checkbox"/> 
                    I'd like to receive more information about the company. I understand and agree to the <a href="/">Privacy Policy</a>.
                </label>

                <button type="submit">Send Message</button>
            </form>
        </div>
    </div>
    </div>
  )
}

export default ContactUs;