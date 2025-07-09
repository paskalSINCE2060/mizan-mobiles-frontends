// Enhanced Chatbot Component with Better User Experience
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import './EnhancedChatbot.css'; // Import your custom styles

const EnhancedChatbot = ({ products = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
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
    const [currentContext, setCurrentContext] = useState(null);
    const [userName, setUserName] = useState('');
    const messagesEndRef = useRef(null);
    
    // Enhanced product categories for better search
    const productCategories = {
        mobile: ['iphone', 'samsung', 'phone', 'smartphone', 'mobile'],
        laptop: ['laptop', 'macbook', 'computer', 'pc'],
        watch: ['watch', 'smartwatch', 'apple watch', 'galaxy watch'],
        accessory: ['earbuds', 'headphones', 'case', 'charger', 'cable']
    };

    // Enhanced response system with context awareness
    const getSmartBotResponse = (message, context = null) => {
        const lowerCaseMsg = message.toLowerCase();
        const words = lowerCaseMsg.split(' ');
        
        // Context-aware responses
        if (context === 'product_search') {
            return handleProductSearch(lowerCaseMsg);
        }
        
        if (context === 'repair_booking') {
            return handleRepairBooking(lowerCaseMsg);
        }

        // Intent detection with better pattern matching
        if (detectIntent(lowerCaseMsg, ['hello', 'hi', 'hey', 'start', 'help'])) {
            const greeting = getTimeBasedGreeting();
            setQuickReplies(["Show products", "Repair service", "Price check", "Warranty info"]);
            return `${greeting} I'm here to help you with all your tech needs! What are you looking for today?`;
        }

        if (detectIntent(lowerCaseMsg, ['price', 'cost', 'how much', 'expensive', 'cheap', 'budget'])) {
            return handlePriceInquiry(lowerCaseMsg);
        }

        if (detectIntent(lowerCaseMsg, ['repair', 'fix', 'broken', 'problem', 'issue', 'service'])) {
            setCurrentContext('repair_booking');
            setQuickReplies(["Phone repair", "Laptop repair", "Screen fix", "Battery issue"]);
            return "I can help you with repairs! What device needs fixing?\n\n• Phone repairs: Screen, battery, charging port\n• Laptop repairs: Hardware, software issues\n• Quick diagnostics available\n\nWhat's the problem with your device?";
        }

        if (detectIntent(lowerCaseMsg, ['warranty', 'guarantee', 'return', 'exchange'])) {
            return "Here's our warranty information:\n\n📱 **iPhones**: 6-month warranty\n💻 **Laptops**: 1-year warranty\n⌚ **Watches**: 6-month warranty\n🎧 **Accessories**: 3-month warranty\n\n• 7-day return policy\n• Free warranty repairs\n• Replacement for defects\n\nNeed help with a specific product warranty?";
        }

        if (detectIntent(lowerCaseMsg, ['delivery', 'shipping', 'when', 'arrive', 'fast'])) {
            return "🚚 **Delivery Options:**\n\n• **Free delivery** on orders above NPR 5,000\n• **Standard**: 2-3 business days\n• **Express**: Next day (NPR 500)\n• **Same day**: Available in Kathmandu (NPR 800)\n\nWant to place an order or track existing one?";
        }

        if (detectIntent(lowerCaseMsg, ['payment', 'pay', 'card', 'esewa', 'khalti', 'cash'])) {
            return "💳 **Payment Methods:**\n\n• Credit/Debit cards\n• eSewa\n• Khalti\n• Cash on delivery\n• Bank transfer\n• Installment plans available\n\nAll transactions are secure and encrypted. Need help with payment?";
        }

        if (detectIntent(lowerCaseMsg, ['sell', 'selling', 'old phone', 'trade', 'exchange'])) {
            return "💰 **Sell Your Device:**\n\n• Instant valuation in 60 seconds\n• Free pickup service\n• Same-day payment\n• Best prices guaranteed\n\nClick 'Sell Now' or tell me your device model for a quick quote!";
        }

        if (detectIntent(lowerCaseMsg, ['order', 'status', 'track', 'where', 'shipped'])) {
            return "📦 **Order Tracking:**\n\nTo check your order status, I'll need:\n• Your order number, or\n• Email used for purchase\n\nYou can also check order status in your account. What's your order number?";
        }

        // Product search with fuzzy matching
        if (detectProductMention(lowerCaseMsg)) {
            setCurrentContext('product_search');
            return handleProductSearch(lowerCaseMsg);
        }

        // Complaint/issue handling
        if (detectIntent(lowerCaseMsg, ['complaint', 'problem', 'issue', 'wrong', 'defective', 'bad'])) {
            return "I'm sorry to hear about the issue. I want to help resolve this quickly:\n\n• **For defective products**: Warranty replacement available\n• **For service issues**: Priority support team\n• **For delivery problems**: Immediate investigation\n\nCan you describe the specific issue you're facing?";
        }

        // Comparison requests
        if (detectIntent(lowerCaseMsg, ['compare', 'vs', 'versus', 'difference', 'better'])) {
            return "I can help you compare products! For the best comparison, tell me:\n\n• Which products you want to compare\n• What features matter most to you\n• Your budget range\n\nExample: 'Compare iPhone 15 vs Samsung Galaxy S24'";
        }

        // Recommendation engine
        if (detectIntent(lowerCaseMsg, ['recommend', 'suggest', 'best', 'good', 'should i buy'])) {
            return "I'd love to recommend the perfect product for you! Tell me:\n\n• What type of device? (Phone, laptop, watch)\n• Your budget range\n• Primary use (work, gaming, photography)\n• Any specific features needed\n\nThis helps me suggest the best options!";
        }

        // Fallback with helpful suggestions
        return "I'm here to help! I can assist you with:\n\n🛒 **Shopping**: Find products, compare prices\n🔧 **Repairs**: Book service, get quotes\n📱 **Sales**: Sell your old devices\n💳 **Orders**: Track, modify, or cancel\n🛡️ **Support**: Warranty, returns, issues\n\nWhat would you like to know more about?";
    };

    // Helper functions
    const detectIntent = (message, keywords) => {
        return keywords.some(keyword => message.includes(keyword));
    };

    const detectProductMention = (message) => {
        for (const [category, keywords] of Object.entries(productCategories)) {
            if (keywords.some(keyword => message.includes(keyword))) {
                return category;
            }
        }
        return false;
    };

    const getTimeBasedGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning!";
        if (hour < 17) return "Good afternoon!";
        return "Good evening!";
    };

    const handleProductSearch = (query) => {
        // Simulate product search - in real app, this would search your product database
        const category = detectProductMention(query);
        
        if (category) {
            setQuickReplies(["Show prices", "Compare models", "Check availability", "More details"]);
            
            switch (category) {
                case 'mobile':
                    return "📱 **Available Phones:**\n\n• iPhone 15 Pro - NPR 180,000\n• Samsung Galaxy S24 - NPR 120,000\n• iPhone 14 - NPR 140,000\n• OnePlus 12 - NPR 90,000\n\nWant to see more details or compare models?";
                
                case 'laptop':
                    return "💻 **Available Laptops:**\n\n• MacBook Pro M3 - NPR 350,000\n• Dell XPS 13 - NPR 200,000\n• HP Pavilion - NPR 120,000\n• Lenovo ThinkPad - NPR 180,000\n\nNeed help choosing the right one?";
                
                case 'watch':
                    return "⌚ **Available Watches:**\n\n• Apple Watch Series 9 - NPR 65,000\n• Samsung Galaxy Watch 6 - NPR 45,000\n• Fitbit Versa 4 - NPR 35,000\n• Garmin Venu 3 - NPR 55,000\n\nWhich features are most important to you?";
                
                default:
                    return "I found several products matching your search. Could you be more specific about what you're looking for?";
            }
        }
        
        return "I can help you find the perfect product! What specific item are you looking for? Try: 'iPhone 15', 'gaming laptop', or 'smartwatch'";
    };

    const handlePriceInquiry = (query) => {
        if (query.includes('range') || query.includes('budget')) {
            return "💰 **Price Ranges:**\n\n📱 **Phones**: NPR 25,000 - NPR 200,000\n💻 **Laptops**: NPR 80,000 - NPR 400,000\n⌚ **Watches**: NPR 15,000 - NPR 80,000\n🎧 **Accessories**: NPR 2,000 - NPR 25,000\n\nWhat's your budget range? I can show you the best options!";
        }
        
        return "I can help you with pricing! Mention a specific product or tell me your budget range. We also offer:\n\n• 💳 Installment plans\n• 🏷️ Regular discounts\n• 📦 Bundle deals\n• 🔄 Trade-in options\n\nWhat product are you interested in?";
    };

    const handleRepairBooking = (query) => {
        if (query.includes('book') || query.includes('appointment')) {
            return "📅 **Book Repair Service:**\n\n1. Tell me your device and issue\n2. I'll provide a quote\n3. Choose your preferred time\n4. Get confirmation\n\nExample: 'iPhone 13 screen cracked'\n\nWhat device needs repair?";
        }
        
        return "🔧 **Repair Services:**\n\n• Screen replacement\n• Battery replacement\n• Charging port repair\n• Water damage recovery\n• Software issues\n• Hardware diagnostics\n\nDescribe your device problem, and I'll help you get it fixed!";
    };

    // Enhanced message sending with better UX
    const sendMessage = async (messageText = inputText) => {
        if (messageText.trim() === '') return;

        // Add user message
        const userMessage = { 
            text: messageText, 
            isBot: false, 
            timestamp: new Date() 
        };
        
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputText('');
        setIsTyping(true);

        // Clear quick replies after user message
        setQuickReplies([]);

        try {
            // Simulate realistic typing delay
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
            
            const botResponse = getSmartBotResponse(messageText, currentContext);
            const botMessage = { 
                text: botResponse, 
                isBot: true, 
                timestamp: new Date() 
            };
            
            const finalMessages = [...updatedMessages, botMessage];
            setMessages(finalMessages);
            
            // Save to localStorage
            saveChatToStorage(finalMessages);
            
        } catch (error) {
            console.error('Error generating response:', error);
            const errorMessage = { 
                text: "I apologize, but I'm having trouble right now. Please try again or contact our support team directly.", 
                isBot: true, 
                timestamp: new Date() 
            };
            setMessages([...updatedMessages, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    // Quick reply handler
    const handleQuickReply = (reply) => {
        sendMessage(reply);
    };

    // Enhanced storage functions
    const saveChatToStorage = (chatMessages) => {
        try {
            const chatData = {
                messages: chatMessages,
                userName,
                lastActive: new Date().toISOString(),
                context: currentContext
            };
            localStorage.setItem('mizan_chat_data', JSON.stringify(chatData));
        } catch (error) {
            console.error('Error saving chat:', error);
        }
    };

    const loadChatFromStorage = () => {
        try {
            const savedData = localStorage.getItem('mizan_chat_data');
            if (savedData) {
                const { messages, userName: savedUserName, context } = JSON.parse(savedData);
                setUserName(savedUserName || '');
                setCurrentContext(context || null);
                return messages || getDefaultMessages();
            }
        } catch (error) {
            console.error('Error loading chat:', error);
        }
        return getDefaultMessages();
    };

    const getDefaultMessages = () => [
        { 
            text: "Hi! I'm your tech assistant. I can help you with:\n• Finding products\n• Pricing information\n• Repair services\n• Warranty details\n• Order status\n\nWhat can I help you with today?", 
            isBot: true,
            timestamp: new Date()
        }
    ];

    // Enhanced clear chat with confirmation
    const clearChatHistory = () => {
        if (window.confirm('Are you sure you want to clear the chat history?')) {
            const initialMessages = getDefaultMessages();
            setMessages(initialMessages);
            setCurrentContext(null);
            setQuickReplies(["Show products", "Repair service", "Price check", "Warranty info"]);
            saveChatToStorage(initialMessages);
            toast.info("Chat history cleared!");
        }
    };

    // Scroll to bottom effect
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Load chat on mount
    useEffect(() => {
        const savedMessages = loadChatFromStorage();
        setMessages(savedMessages);
    }, []);

    // Enhanced export with more data
    const exportChatHistory = () => {
        try {
            const exportData = {
                messages,
                userName,
                exportDate: new Date().toISOString(),
                context: currentContext,
                totalMessages: messages.length
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `mizan_chat_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            toast.success("Chat history exported successfully!");
        } catch (error) {
            console.error('Error exporting chat:', error);
            toast.error("Failed to export chat history");
        }
    };

    return (
        <div className="enhanced-chatbot-container">
            <button 
                className={`chat-toggle-btn ${isOpen ? 'active' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle chat"
            >
                {isOpen ? '×' : '💬'}
            </button>

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="chat-title">
                            <div className="chat-avatar">🤖</div>
                            <div>
                                <div className="bot-name">Mizan Assistant</div>
                                <div className="bot-status">Online • Ready to help</div>
                            </div>
                        </div>
                        <button 
                            className="chat-close" 
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                        >
                            ×
                        </button>
                    </div>
                    
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                                <div className="message-content">
                                    <div className="message-text">{msg.text}</div>
                                    <div className="message-time">
                                        {msg.timestamp?.toLocaleTimeString([], { 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {isTyping && (
                            <div className="message bot">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                        
                        {quickReplies.length > 0 && (
                            <div className="quick-replies">
                                {quickReplies.map((reply, index) => (
                                    <button 
                                        key={index}
                                        className="quick-reply-btn"
                                        onClick={() => handleQuickReply(reply)}
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>
                    
                    <div className="chat-actions">
                        <button 
                            className="chat-action-btn" 
                            onClick={clearChatHistory}
                            title="Clear chat history"
                        >
                            🗑️
                        </button>
                        <button 
                            className="chat-action-btn" 
                            onClick={exportChatHistory}
                            title="Export chat history"
                        >
                            📥
                        </button>
                    </div>
                    
                    <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="chat-input-container">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type your message..."
                            className="chat-input"
                            disabled={isTyping}
                        />
                        <button 
                            type="submit" 
                            className="chat-send-btn"
                            disabled={isTyping || !inputText.trim()}
                        >
                            {isTyping ? '...' : '➤'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default EnhancedChatbot;