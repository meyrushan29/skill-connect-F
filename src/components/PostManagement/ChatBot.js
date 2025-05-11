import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, User, Bot, HelpCircle, Coffee, Code, Globe, BookOpen, TrendingUp } from 'lucide-react';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: `👋 Hello! I'm your helpful AI assistant. I can help you with various topics like:

• 🌟 General knowledge
• 💻 Programming and technology
• 🚀 Career advice
• 📚 Learning and education
• 🎯 Personal development
• 🗺️ Travel recommendations

Feel free to ask me anything or type "help" to see all available commands!`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Default responses for common questions
  const defaultResponses = {
    // Greetings
    'hello': 'Hello! How can I assist you today? 😊',
    'hi': 'Hi there! What can I help you with?',
    'hey': 'Hey! I\'m here to help. What\'s on your mind?',
    'good morning': 'Good morning! Hope you\'re having a great start to your day! ☀️',
    'good afternoon': 'Good afternoon! How can I help you today?',
    'good evening': 'Good evening! What can I assist you with?',
    
    // Help and commands
    'help': `Available commands:
• "help" - Show this menu
• "about" - Learn about me
• "tips" - Get daily tips
• "joke" - Tell me a joke
• "quote" - Get an inspirational quote
• "weather" - General weather advice
• "programming" - Get coding help
• "career" - Career advice
• "study" - Study tips

Just type any command or ask me anything!`,
    
    // About the bot
    'about': 'I\'m a friendly AI assistant designed to help answer your questions and provide useful information across various topics. I can discuss technology, career advice, personal development, and much more!',
    'who are you': 'I\'m your AI assistant, here to help with questions, provide advice, and chat about various topics. Think of me as your digital helper! 🤖',
    
    // General questions
    'how are you': 'I\'m doing great, thank you for asking! How are you doing today?',
    'what can you do': 'I can help with many things! Ask me about programming, career advice, study tips, get jokes or quotes, or just chat about general topics. Type "help" to see all commands.',
    
    // Fun responses
    'joke': [
      'Why do programmers prefer dark mode? Because light attracts bugs! 🐛',
      'Why did the scarecrow win an award? Because he was outstanding in his field! 🌾',
      'What did the ocean say to the beach? Nothing, it just waved! 🌊',
      'Why don\'t scientists trust atoms? Because they make up everything! ⚛️',
      'What do you call a fake noodle? An impasta! 🍝'
    ],
    
    'quote': [
      '"The only way to do great work is to love what you do." - Steve Jobs',
      '"Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill',
      '"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt',
      '"Innovation distinguishes between a leader and a follower." - Steve Jobs',
      '"The only impossible journey is the one you never begin." - Tony Robbins'
    ],
    
    // Technical help
    'programming': `Popular programming topics I can help with:
• JavaScript, Python, Java, C++
• Web development (HTML, CSS, React)
• Database design
• Algorithm and data structures
• Debugging tips
• Best practices

Ask me specific questions like "How to center a div in CSS?" or "What is a closure in JavaScript?"`,
    
    'javascript': 'JavaScript is a versatile programming language used for web development. Key concepts include: variables, functions, objects, arrays, promises, and async/await. Want to know about a specific JavaScript topic?',
    
    'python': 'Python is a powerful, beginner-friendly language great for web development, data science, and automation. Key features: simple syntax, extensive libraries, strong community support. What Python topic interests you?',
    
    'react': 'React is a popular JavaScript library for building user interfaces. Key concepts: components, state, props, hooks, lifecycle methods. Need help with a specific React concept?',
    
    // Career advice
    'career': `Career advice I can provide:
• Resume writing tips
• Interview preparation
• Skill development
• Job search strategies
• Professional networking
• Career transitions

What specific career aspect would you like to discuss?`,
    
    'resume': `Resume tips:
• Keep it concise (1-2 pages)
• Use action verbs
• Quantify achievements
• Tailor to each job
• Include relevant keywords
• Proofread carefully

Would you like specific advice on any resume section?`,
    
    'interview': `Interview preparation tips:
• Research the company thoroughly
• Practice common questions
• Prepare your own questions
• Dress appropriately
• Arrive early
• Follow up with a thank-you email

Need help with specific interview questions?`,
    
    // Study tips
    'study': `Effective study tips:
• Create a study schedule
• Use active learning techniques
• Take regular breaks (Pomodoro method)
• Find a quiet study space
• Form study groups
• Teach others what you learn

What subject are you studying?`,
    
    'tips': [
      '💡 Take a 5-minute walk every hour to boost productivity!',
      '📚 Use the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.',
      '🧘‍♀️ Practice deep breathing for 2 minutes to reduce stress.',
      '💻 Keep your workspace clean and organized for better focus.',
      '🥤 Stay hydrated - aim for 8 glasses of water per day!'
    ],
    
    // Common questions
    'weather': 'I don\'t have access to real-time weather data, but I recommend checking your local weather app or website for the most accurate forecast. Don\'t forget to dress appropriately and stay safe! ☁️',
    
    'time': `I don't have access to real-time data, but you can check the current time on your device. Time management tip: Use the Pomodoro Technique - work for 25 minutes, then take a 5-minute break! ⏰`,
    
    // Default fallback responses
    fallback: [
      'That\'s an interesting question! Could you tell me more about it?',
      'I\'m not sure about that specific topic, but I\'d be happy to help with something else. Type "help" to see what I can do!',
      'Let me think about that... Could you rephrase the question? I want to give you the best answer possible.',
      'I don\'t have information on that exact topic, but I can help with programming, career advice, study tips, and more. What else can I assist you with?',
      'That\'s outside my current knowledge base. Perhaps I can help you with something else? Try asking about technology, career advice, or type "joke" for a laugh!'
    ]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getRandomResponse = (responses) => {
    if (Array.isArray(responses)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
    return responses;
  };

  const getBotResponse = (input) => {
    const normalizedInput = input.toLowerCase().trim();
    
    // Look for exact matches
    if (defaultResponses[normalizedInput]) {
      return getRandomResponse(defaultResponses[normalizedInput]);
    }
    
    // Look for partial matches
    for (const [key, response] of Object.entries(defaultResponses)) {
      if (normalizedInput.includes(key) || key.includes(normalizedInput)) {
        return getRandomResponse(response);
      }
    }
    
    // Advanced pattern matching
    if (normalizedInput.includes('how to')) {
      return `To help you with "${input}", I'll need more specific details. You can ask me about:
• Programming ("How to center a div?")
• Study tips ("How to study effectively?")
• Career advice ("How to write a resume?")
• General topics ("How to stay motivated?")`;
    }
    
    if (normalizedInput.includes('what is')) {
      const topic = normalizedInput.replace('what is', '').trim();
      if (topic) {
        return `Great question about "${topic}"! I can provide information on many topics. Try these related commands:
• "programming" for tech topics
• "career" for professional advice
• "study" for learning tips
• Or be more specific with your question!`;
      }
    }
    
    if (normalizedInput.includes('help') || normalizedInput === '?') {
      return defaultResponses.help;
    }
    
    // Default fallback
    return getRandomResponse(defaultResponses.fallback);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // Simulate thinking time
    setTimeout(() => {
      const response = getBotResponse(currentInput);
      
      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsLoading(false);
    }, 500 + Math.random() * 1000); // Random delay between 0.5 to 1.5 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestedQuestions = [
    { text: 'Get a joke', icon: <Coffee size={16} /> },
    { text: 'Programming help', icon: <Code size={16} /> },
    { text: 'Career advice', icon: <TrendingUp size={16} /> },
    { text: 'Study tips', icon: <BookOpen size={16} /> },
  ];

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid #e4e6eb',
        backgroundColor: '#1877f2',
        color: 'white',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <Bot size={20} color="white" />
          <h1 style={{
            fontSize: '16px',
            fontWeight: '600',
            margin: 0,
          }}>
            AI Assistant
          </h1>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          opacity: 0.9,
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#4ade80',
          }} />
          Online
        </div>
      </div>

      {/* Messages Container */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        backgroundColor: '#f8f9fa',
      }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              marginBottom: '16px',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              maxWidth: '75%',
              flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: message.role === 'user' ? '#e4e6eb' : '#1877f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {message.role === 'user' ? 
                  <User size={16} color="#606266" /> : 
                  <Bot size={16} color="white" />
                }
              </div>
              <div style={{
                padding: '12px 16px',
                borderRadius: message.role === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                backgroundColor: message.role === 'user' ? '#1877f2' : 'white',
                color: message.role === 'user' ? 'white' : '#1c1e21',
                fontSize: '14px',
                lineHeight: '1.4',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}>
                <p style={{ 
                  margin: 0, 
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {message.content}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div style={{
            display: 'flex',
            marginBottom: '16px',
            justifyContent: 'flex-start',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#1877f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Bot size={16} color="white" />
              </div>
              <div style={{
                padding: '12px 16px',
                borderRadius: '16px 16px 16px 0',
                backgroundColor: 'white',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <div className="animate-spin" style={{ width: '16px', height: '16px' }}>
                  <Loader2 size={16} color="#65676b" />
                </div>
                <span style={{ color: '#65676b', fontSize: '14px' }}>thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div style={{
          padding: '8px 16px',
          borderTop: '1px solid #e4e6eb',
          backgroundColor: 'white',
        }}>
          <div style={{
            fontSize: '12px',
            color: '#65676b',
            marginBottom: '8px',
          }}>
            Quick questions:
          </div>
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}>
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question.text)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  backgroundColor: '#f0f2f5',
                  border: '1px solid #dadde1',
                  borderRadius: '16px',
                  fontSize: '12px',
                  color: '#65676b',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#e4e6eb';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f2f5';
                }}
              >
                {question.icon}
                <span>{question.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{
        padding: '16px',
        borderTop: '1px solid #e4e6eb',
        backgroundColor: 'white',
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message... (try 'help' for commands)"
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '24px',
              border: '1px solid #dadde1',
              fontSize: '14px',
              backgroundColor: '#f0f2f5',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#1877f2';
              e.target.style.backgroundColor = 'white';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#dadde1';
              e.target.style.backgroundColor = '#f0f2f5';
            }}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            style={{
              padding: '0',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: (isLoading || !input.trim()) ? 'not-allowed' : 'pointer',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              if (!isLoading && input.trim()) {
                e.currentTarget.style.backgroundColor = '#f0f2f5';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Send 
              size={18} 
              color={isLoading || !input.trim() ? '#bec3c9' : '#1877f2'} 
            />
          </button>
        </div>
      </form>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ChatBot;