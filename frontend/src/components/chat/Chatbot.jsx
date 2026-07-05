import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm MediBot. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Greeting
    if (lowerMessage.match(/\b(hi|hello|hey|greetings|morning|afternoon)\b/)) {
      return "Hello! I am MediBot. How can I assist you with your healthcare needs today?";
    }
    
    // Booking
    if (lowerMessage.match(/\b(book|appointment|schedule|consultation|see a doctor)\b/)) {
      return "To book an appointment, please click the 'Book Appointment' button on the navigation bar, or visit our 'Doctors' page to choose a specific specialist. Our smart scheduling system will find the best slot for you!";
    }
    
    // Hours & Time
    if (lowerMessage.match(/\b(hours|time|open|close|when are you open)\b/)) {
      return "Our clinic is open Monday through Saturday, from 8:00 AM to 8:00 PM. We are closed on Sundays except for emergencies.";
    }
    
    // Location
    if (lowerMessage.match(/\b(location|where|address|find you)\b/)) {
      return "We are conveniently located at 123 Healthcare Ave, Medical District, NY 10001. You can find a map on our Contact page.";
    }
    
    // Insurance & Payment
    if (lowerMessage.match(/\b(insurance|medicare|pay|cost|fee)\b/)) {
      return "We accept most major insurance plans including Medicare, BlueCross, and UnitedHealthcare. Consultation fees vary by specialist (typically $600-$1000). Please check individual doctor profiles for specific fees.";
    }
    
    // Specialties
    if (lowerMessage.match(/\b(specialist|cardiologist|dermatologist|neurologist|doctor)\b/)) {
      return "We have top-tier specialists across Cardiology, Dermatology, Neurology, Pediatrics, Orthopedics, and Gynecology. Head over to our 'Doctors' page to view their profiles and book a session.";
    }
    
    // Emergency
    if (lowerMessage.match(/\b(emergency|urgent|pain|help me right now)\b/)) {
      return "If this is a medical emergency, please call 911 immediately or proceed to the nearest emergency room. For urgent but non-life-threatening clinic matters, call us at (555) 123-4567.";
    }

    // Thank you
    if (lowerMessage.match(/\b(thank you|thanks|bye|goodbye)\b/)) {
      return "You're very welcome! Let me know if you need anything else. Have a healthy day!";
    }
    
    // Fallback
    return "I'm still learning, so I might not have the answer to that. For specific medical advice or complex questions, please contact our clinic directly at (555) 123-4567 or email support@medislot.ai.";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate network delay for bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: generateResponse(userMessage.text),
        sender: 'bot'
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button 
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(37,99,235,0.4)] hover:bg-blue-700 transition-colors z-50"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <MessageSquare size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] border border-slate-200 z-50 flex flex-col overflow-hidden"
            style={{ height: '500px', maxHeight: '80vh' }}
          >
            {/* Header */}
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">MediBot</h3>
                  <p className="text-xs text-blue-200">Online | Automated Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4 custom-scrollbar">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-auto">
                      <Bot size={16} className="text-blue-600" />
                    </div>
                  )}
                  
                  <div className={`p-3 rounded-2xl max-w-[75%] text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'}`}>
                    {msg.text}
                  </div>
                  
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-auto">
                      <User size={16} className="text-slate-500" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-auto">
                    <Bot size={16} className="text-blue-600" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 rounded-bl-none shadow-sm flex items-center">
                    <Loader2 size={16} className="text-blue-600 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 shrink-0 flex gap-2">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..." 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 disabled:bg-slate-300 transition-colors"
              >
                <Send size={16} className="ml-1" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
