import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import './Homepage.css';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify"; 
// Import product images
import galaxybuds3 from '../../assets/GalaxyBuds3.jpeg'
import hero_image from '../../assets/banner.png'
import buylaptops from '../../assets/BuyLaptops.webp'
import buyPhone from '../../assets/buyPhone.webp'
import buySmartWatches from '../../assets/BuySmartWatches.webp'
import findnewphone from '../../assets/FindNewPhone.webp'
import recycle from '../../assets/Recycle.webp'
import repairphone from '../../assets/RepairPhone.webp'
import repairLaptop from '../../assets/RepairLaptop.webp'
import sellPhone from '../../assets/sellPhone.webp'
import sale from '../../assets/sale.png'
import PremiumSmartphonesSection from "./PremiumSmartphonesSection";
import GalaxyProductsSection from "./GalaxyProductsSection";

// Enhanced Chatbot Component
const EnhancedChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [messages, setMessages] = useState([
        { 
            text: "Hi! I'm your tech assistant. I can help you with:\n• Finding products\n• Pricing information\n• Repair services\n• Warranty details\n• Order status\n\nWhat can I help you with today?", 
            isBot: true,
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [quickReplies, setQuickReplies] = useState([
        "Show me iPhones", "Repair my phone", "Check warranty", "Price range", "Order status"
    ]);
    const messagesEndRef = useRef(null);

    const getBotResponse = (message) => {
        const lowerCaseMsg = message.toLowerCase();
        
        if (lowerCaseMsg.includes('price') || lowerCaseMsg.includes('cost')) {
            return "💰 **Price Ranges:**\n\n📱 **Phones**: NPR 25,000 - NPR 200,000\n💻 **Laptops**: NPR 80,000 - NPR 400,000\n⌚ **Watches**: NPR 15,000 - NPR 80,000\n🎧 **Accessories**: NPR 2,000 - NPR 25,000\n\nWhat's your budget range?";
        } else if (lowerCaseMsg.includes('delivery') || lowerCaseMsg.includes('shipping')) {
            return "🚚 **Delivery Options:**\n\n• **Free delivery** on orders above NPR 5,000\n• **Standard**: 2-3 business days\n• **Express**: Next day (NPR 500)\n• **Same day**: Available in Kathmandu (NPR 800)";
        } else if (lowerCaseMsg.includes('return')) {
            return "📦 **Return Policy:**\n\n• 7-day return policy for most products\n• Item must be in original condition\n• Free return pickup\n• Refund processed within 5-7 days";
        } else if (lowerCaseMsg.includes('payment') || lowerCaseMsg.includes('pay')) {
            return "💳 **Payment Methods:**\n\n• Credit/Debit cards\n• eSewa\n• Khalti\n• Cash on delivery\n• Bank transfer\n• Installment plans available";
        } else if (lowerCaseMsg.includes('warranty')) {
            return "🛡️ **Warranty Information:**\n\n📱 **iPhones**: 6-month warranty\n💻 **Laptops**: 1-year warranty\n⌚ **Watches**: 6-month warranty\n🎧 **Accessories**: 3-month warranty\n\n• Free warranty repairs\n• Replacement for defects";
        } else if (lowerCaseMsg.includes('repair')) {
            return "🔧 **Repair Services:**\n\n• Screen replacement\n• Battery replacement\n• Charging port repair\n• Water damage recovery\n• Software issues\n• Hardware diagnostics\n\nWhat device needs repair?";
        } else if (lowerCaseMsg.includes('iphone') || lowerCaseMsg.includes('phone')) {
            return "📱 **Available Phones:**\n\n• iPhone 15 Pro - NPR 180,000\n• Samsung Galaxy S24 - NPR 120,000\n• iPhone 14 - NPR 140,000\n• OnePlus 12 - NPR 90,000\n\nWant to see more details?";
        } else if (lowerCaseMsg.includes('hello') || lowerCaseMsg.includes('hi') || lowerCaseMsg.includes('hey')) {
            return "Hello! How can I assist you with our tech products today?";
        } else if (lowerCaseMsg.includes('thank')) {
            return "You're welcome! Is there anything else I can help you with?";
        } else if (lowerCaseMsg.includes('bye') || lowerCaseMsg.includes('goodbye')) {
            return "Thank you for chatting with us! Feel free to return if you have more questions.";
        } else if (lowerCaseMsg.includes('sell') || lowerCaseMsg.includes('selling')) {
            return "💰 **Sell Your Device:**\n\n• Instant valuation in 60 seconds\n• Free pickup service\n• Same-day payment\n• Best prices guaranteed\n\nClick 'Sell Now' or tell me your device model!";
        } else {
            return "I'm here to help! I can assist you with:\n\n🛒 **Shopping**: Find products, compare prices\n🔧 **Repairs**: Book service, get quotes\n📱 **Sales**: Sell your old devices\n💳 **Orders**: Track, modify, or cancel\n🛡️ **Support**: Warranty, returns, issues\n\nWhat would you like to know more about?";
        }
    };

    const sendMessage = async (messageText = inputText) => {
        if (messageText.trim() === '') return;

        const userMessage = { 
            text: messageText, 
            isBot: false, 
            timestamp: new Date() 
        };
        
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputText('');
        setIsTyping(true);
        setQuickReplies([]);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const botResponse = getBotResponse(messageText);
            const botMessage = { 
                text: botResponse, 
                isBot: true, 
                timestamp: new Date() 
            };
            
            const finalMessages = [...updatedMessages, botMessage];
            setMessages(finalMessages);
            
        } catch (error) {
            console.error('Error generating response:', error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleQuickReply = (reply) => {
        sendMessage(reply);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="enhanced-chatbot-container">
            <button 
                className={`chat-toggle-btn ${isOpen ? 'active' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: isOpen 
                        ? 'linear-gradient(135deg, #ff6b6b, #ee5a24)' 
                        : 'linear-gradient(135deg, #007bff, #0056b3)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: isHovered 
                        ? '0 8px 25px rgba(0,123,255,0.4)' 
                        : '0 4px 15px rgba(0,0,0,0.2)',
                    zIndex: 1000,
                    transition: 'all 0.3s ease',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}
            >
                {isOpen ? (
                    <svg 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                            transition: 'transform 0.3s ease',
                            transform: isHovered ? 'rotate(90deg)' : 'rotate(0deg)'
                        }}
                    >
                        <path 
                            d="M18 6L6 18M6 6l12 12" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                    </svg>
                ) : (
                    <svg 
                        width="28" 
                        height="28" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                            transition: 'transform 0.3s ease',
                            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                        }}
                    >
                        <path 
                            d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H6L10 22L14 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" 
                            fill="currentColor" 
                            fillOpacity="0.9"
                        />
                        <circle cx="7" cy="9" r="1.5" fill="rgba(255,255,255,0.8)" />
                        <circle cx="12" cy="9" r="1.5" fill="rgba(255,255,255,0.8)" />
                        <circle cx="17" cy="9" r="1.5" fill="rgba(255,255,255,0.8)" />
                        <circle 
                            cx="18" 
                            cy="6" 
                            r="3" 
                            fill="#ff4757"
                            style={{
                                animation: isHovered ? 'pulse 1s infinite' : 'none'
                            }}
                        />
                    </svg>
                )}
                
                <div 
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        transform: 'translate(-50%, -50%)',
                        animation: isHovered ? 'ripple 2s infinite' : 'none'
                    }}
                />
            </button>

            {isOpen && (
                <div className="chat-window" style={{
                    position: 'fixed',
                    bottom: '90px',
                    right: '20px',
                    width: '350px',
                    height: '500px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    zIndex: 1000
                }}>
                    <div className="chat-header" style={{
                        padding: '16px',
                        background: '#007bff',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div className="chat-title" style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="chat-avatar" style={{ marginRight: '8px' }}>🤖</div>
                            <div>
                                <div className="bot-name" style={{ fontWeight: 'bold' }}>Mizan Assistant</div>
                                <div className="bot-status" style={{ fontSize: '12px', opacity: 0.8 }}>Online • Ready to help</div>
                            </div>
                        </div>
                        <button 
                            className="chat-close" 
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '24px',
                                cursor: 'pointer'
                            }}
                        >
                            ×
                        </button>
                    </div>
                    
                    <div className="chat-messages" style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '16px'
                    }}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`} style={{
                                marginBottom: '12px',
                                display: 'flex',
                                justifyContent: msg.isBot ? 'flex-start' : 'flex-end'
                            }}>
                                <div className="message-content" style={{
                                    maxWidth: '80%',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    background: msg.isBot ? '#f1f1f1' : '#007bff',
                                    color: msg.isBot ? 'black' : 'white',
                                    whiteSpace: 'pre-line'
                                }}>
                                    <div className="message-text">{msg.text}</div>
                                    <div className="message-time" style={{
                                        fontSize: '10px',
                                        opacity: 0.7,
                                        marginTop: '4px'
                                    }}>
                                        {msg.timestamp?.toLocaleTimeString([], { 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {isTyping && (
                            <div className="message bot" style={{
                                marginBottom: '12px',
                                display: 'flex',
                                justifyContent: 'flex-start'
                            }}>
                                <div className="typing-indicator" style={{
                                    padding: '8px 12px',
                                    background: '#f1f1f1',
                                    borderRadius: '8px'
                                }}>
                                    <span>●</span>
                                    <span>●</span>
                                    <span>●</span>
                                </div>
                            </div>
                        )}
                        
                        {quickReplies.length > 0 && (
                            <div className="quick-replies" style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px',
                                marginTop: '12px'
                            }}>
                                {quickReplies.map((reply, index) => (
                                    <button 
                                        key={index}
                                        className="quick-reply-btn"
                                        onClick={() => handleQuickReply(reply)}
                                        style={{
                                            padding: '6px 12px',
                                            background: '#e3f2fd',
                                            border: '1px solid #007bff',
                                            borderRadius: '16px',
                                            color: '#007bff',
                                            fontSize: '12px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>
                    
                    <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="chat-input-container" style={{
                        display: 'flex',
                        padding: '16px',
                        borderTop: '1px solid #eee'
                    }}>
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type your message..."
                            className="chat-input"
                            disabled={isTyping}
                            style={{
                                flex: 1,
                                padding: '8px 12px',
                                border: '1px solid #ddd',
                                borderRadius: '20px',
                                outline: 'none'
                            }}
                        />
                        <button 
                            type="submit" 
                            className="chat-send-btn"
                            disabled={isTyping || !inputText.trim()}
                            style={{
                                marginLeft: '8px',
                                padding: '8px 16px',
                                background: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px',
                                cursor: 'pointer'
                            }}
                        >
                            {isTyping ? '...' : '➤'}
                        </button>
                    </form>
                </div>
            )}
            
            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.7; }
                }
                
                @keyframes ripple {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 0.7; }
                    100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

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

    return (
        <>
            {/* Use the Enhanced Chatbot Component */}
            <EnhancedChatbot />

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
                        <a href="/smartphone" className="category">
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
                        
                        <a href="/laptops" className="category">
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
                        
                        <a href="/watches" className="category">
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