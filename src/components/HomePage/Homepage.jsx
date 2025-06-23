import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import './Homepage.css';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify"; 
// Import product images
import galaxybuds3 from '../../assets/GalaxyBuds3.jpeg'
import hero_image from '../../assets/banner.png'
import buylaptops from '../../assets/BuyLaptops.webp'
import buyPhone from '../../assets/buyPhone.webp'
import buySmartWatches from '../../assets/BuySmartWatches.webp'
import findnewphone from '../../assets/FindNewPhone.webp'
import nearbystore from '../../assets/NearbyStores.webp'
import recycle from '../../assets/Recycle.webp'
import repairphone from '../../assets/RepairPhone.webp'
import repairLaptop from '../../assets/RepairLaptop.webp'
import sellPhone from '../../assets/sellPhone.webp'
import sale from '../../assets/sale.png'
import PremiumSmartphonesSection from "./PremiumSmartphonesSection";
import GalaxyProductsSection from "./GalaxyProductsSection";

function HomePage() {
    const location = useLocation();

    // Handle scrolling to services when navigating from another page
    useEffect(() => {
        if (location.state?.scrollToServices) {
            const timer = setTimeout(() => {
                const servicesSection = document.getElementById('services');
                if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
            
            return () => clearTimeout(timer);
        }
    }, [location.state]);

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi there! How can I help you today?", isBot: true }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    
    const toggleChat = () => {
        setIsOpen(!isOpen);
    };
    
    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    const loadChatFromStorage = () => {
        try {
            const savedChat = localStorage.getItem('mizan_chat_history');
            if (savedChat) {
                return JSON.parse(savedChat);
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
        return [{ text: "Hi there! How can I help you today?", isBot: true }];
    };

    const saveChatToStorage = (chatMessages) => {
        try {
            localStorage.setItem('mizan_chat_history', JSON.stringify(chatMessages));
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const savedMessages = loadChatFromStorage();
        setMessages(savedMessages);
    }, []);
    
    const getBotResponse = (message) => {
        const lowerCaseMsg = message.toLowerCase();
        
        if (lowerCaseMsg.includes('price') || lowerCaseMsg.includes('cost')) {
            return "Our products vary in price. You can check individual product pages for pricing details. We offer discounts on many items!";
        } else if (lowerCaseMsg.includes('delivery') || lowerCaseMsg.includes('shipping')) {
            return "We offer free delivery on orders above NPR 5000. Standard delivery takes 2-3 business days.";
        } else if (lowerCaseMsg.includes('return')) {
            return "We have a 7-day return policy for most products. Please make sure the item is in its original condition.";
        } else if (lowerCaseMsg.includes('payment') || lowerCaseMsg.includes('pay')) {
            return "We accept credit/debit cards, eSewa, Khalti, and cash on delivery.";
        } else if (lowerCaseMsg.includes('warranty')) {
            return "All our products come with a standard warranty. iPhones have a 6-month warranty, and Samsung products have a 1-year warranty.";
        } else if (lowerCaseMsg.includes('hello') || lowerCaseMsg.includes('hi') || lowerCaseMsg.includes('hey')) {
            return "Hello! How can I assist you with our tech products today?";
        } else if (lowerCaseMsg.includes('thank')) {
            return "You're welcome! Is there anything else I can help you with?";
        } else if (lowerCaseMsg.includes('bye') || lowerCaseMsg.includes('goodbye')) {
            return "Thank you for chatting with us! Feel free to return if you have more questions.";
        } else if (lowerCaseMsg.includes('sell') || lowerCaseMsg.includes('selling')) {
            return "Yes, we buy used smartphones! Click the 'Sell Now' button to get an instant valuation for your device.";
        } else if (lowerCaseMsg.includes('condition') || lowerCaseMsg.includes('quality')) {
            return "All our pre-loved products are professionally inspected and thoroughly tested. We guarantee they're in excellent working condition.";
        } else if (lowerCaseMsg.includes('wishlist')) {
            return `You have  items in your wishlist. You can view and manage your wishlist by clicking the heart icon on any product.`;
        } else {
            return "Thanks for your message. If you have questions about our products or services, please let me know specifically what you're looking for.";
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (inputText.trim() === '') return;

        // Add user message
        const updatedMessages = [...messages, { text: inputText, isBot: false }];
        setMessages(updatedMessages);
        saveChatToStorage(updatedMessages);
        
        setInputText('');
        setIsTyping(true);

        // Simulate bot reply after delay
        setTimeout(() => {
            const botResponse = getBotResponse(inputText);
            const messagesWithBotResponse = [...updatedMessages, { text: botResponse, isBot: true }];
            setMessages(messagesWithBotResponse);
            saveChatToStorage(messagesWithBotResponse);
            setIsTyping(false);
        }, 1000);
    };

    const clearChatHistory = () => {
        const initialMessage = [{ text: "Hi there! How can I help you today?", isBot: true }];
        setMessages(initialMessage);
        saveChatToStorage(initialMessage);
        toast.info("Chat history cleared!");
    };

    const exportChatHistory = () => {
        try {
            const chatData = JSON.stringify(messages, null, 2);
            const blob = new Blob([chatData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `mizan_chat_history_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            toast.success("Chat history exported successfully!");
        } catch (error) {
            console.error('Error exporting chat history:', error);
            toast.error("Failed to export chat history");
        }
    };

    return (
        <>
            <div className="chatbot-container">
                <button className={`chat-toggle-btn ${isOpen ? 'active' : ''}`} onClick={toggleChat}>
                    {isOpen ? (
                        <span>×</span>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    )}
                </button>

                <div className={`chat-window ${isOpen ? 'open' : ''}`}>
                    <div className="chat-header">
                        <div className="chat-title">
                            <div className="chat-avatar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                                </svg>
                            </div>
                            Mizan Support
                        </div>
                        <button className="chat-close" onClick={toggleChat}>×</button>
                    </div>
                    
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    <div className="chat-actions">
                        <button className="chat-action-btn" onClick={clearChatHistory}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                            </svg>
                            Clear
                        </button>
                        <button className="chat-action-btn" onClick={exportChatHistory}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Export
                        </button>
                    </div>
                    
                    <form onSubmit={sendMessage} className="chat-input-container">
                        <input
                            type="text"
                            value={inputText}
                            onChange={handleInputChange}
                            placeholder="Type your message..."
                            className="chat-input"
                        />
                        <button type="submit" className="chat-send-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>

            <div className="white">
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar />            
                <section className="hero">
                    <div className="hero-content">
                        <a href="/categories">
                            <button>
                                Shop Now
                            </button>
                        </a>
                    </div>
                </section>

                {/* iPhone Products Section - UPDATED WITH WISHLIST */}
                <PremiumSmartphonesSection/>
                <div className="why-us-container">
                    <div className="why-us-content">
                        <h2>Why us?</h2>
                        <p>
                        The products we sell are professionally inspected and thoroughly tested using a full diagnostic testing software. Our skilled professionals make sure that the products that reach your doorsteps are always in a pristine condition.
                        </p>
                    </div>
                    <div className="why-us-features">
                        <div className="why-us-feature">
                        <div className="why-us-feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                        <div className="why-us-feature-content">
                            <h3>Product you can trust</h3>
                            <p>You'll always have a tested and certified latest piece of tech and a Happy Wallet all the time.</p>
                        </div>
                        </div>
                        <div className="why-us-feature">
                        <div className="why-us-feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="why-us-feature-content">
                            <h3>Quality you can rely on</h3>
                            <p>Our working professionals make sure that the utmost quality products are always in a top-notch condition.</p>
                        </div>
                        </div>
                    </div>
                </div>

                {/* Galaxy Products Section - UPDATED WITH WISHLIST */}
                <GalaxyProductsSection/>

                {/* Valentine's Day Banner */}
                <header className="banner-content-header">
                    <div className="banner-content-banner">
                        <img src={hero_image} alt="Valentine's Day Sale Banner"/>
                    </div>
                </header>

                {/* Services Section */}
                <section className="banner-content-services" id="services">
                    <h2>Our Services</h2>
                    <div className="banner-content-services-container">
                        {[
                            { img: sellPhone, text: 'Sell Phone' },
                            { img: buyPhone, text: 'Buy Phone' },
                            { img: buylaptops, text: 'Buy Laptops' },
                            { img: repairphone, text: 'Repair Phone' },
                            { img: repairLaptop, text: 'Repair Laptop' },
                            { img: findnewphone, text: 'Find New Phone' },
                            { img: nearbystore, text: 'Nearby Stores' },
                            { img: buySmartWatches, text: 'Buy Smartwatches' },
                            { img: recycle, text: 'Recycle' }
                        ].map((service, index) => (
                            <div key={index} className="banner-content-service">
                                <img src={service.img} alt={service.text}/>
                                <p>{service.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="sell-your-smartphone-container">
                    <div className="sell-your-smartphone-wrapper">
                        <div className="sell-your-smartphone-content">
                            <h1 className="sell-your-smartphone-title">Wanna Sell Your Smartphone?</h1>
                            <p className="sell-your-smartphone-description">
                                Get Instant Valuation in just a minute. Just enter your device's true condition and get a price quote. 
                                Get Door-step Pickup with Same Day Payment Guaranteed.
                            </p>
                            <a href="/sellyourphone">
                            <button className="sell-your-smartphone-cta">Sell Now</button>
                            </a>
                        </div>
                        <div className="sell-your-smartphone-devices">
                            <img src={sale} alt="" />
                        </div>
                    </div>
                </div>

                <div className="marketplace-container">
                    <h1 className="marketplace-title">Buy + Sell + Save</h1>
                    
                    <div className="product-categories">
                        <a href="/smartphone"
                        className="category">
                        <div className="category">
                               <h2>Phones + iPhones</h2>
                              <div className="product-image">
                                <img src={sellPhone} alt="Phone Collection"/>
                              </div>
                             <div className="category-stats">
                             <span className="listings">15996 approved listings</span>
                            <span className="sellers">1398 legit sellers</span>
                            </div>
                         </div>                        
                        </a>
                        
                        <a href="/tablets"
                        className="category">
                        <div className="category">
                            <h2>MacBooks + Laptops</h2>
                            <div className="product-image">
                                <img src={buylaptops} alt="Laptop Collection"/>
                            </div>
                            <div className="category-stats">
                                <span className="listings">1022 approved listings</span>
                                <span className="sellers">450 legit sellers</span>
                            </div>
                        </div>
                        </a>
                        
                        <a href="/watches"
                        className="category">
                        <div className="category">
                            <h2>Watches</h2>
                            <div className="product-image">
                                <img src={galaxybuds3} alt="Watch Collection" />
                            </div>
                            <div className="category-stats">
                                <span className="listings">1017 approved listings</span>
                                <span className="sellers">271 legit sellers</span>
                            </div>
                        </div>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomePage;