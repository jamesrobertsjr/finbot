import React, { useState } from 'react';

//Setting up axios
import axios from 'axios';

//import textarea
//import TextareaAutosize from 'react-textarea-autosize';


import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userMessage = { text: query, isUser: true };
    const botMessagePlaceholder = { text: '...', isUser: false };

    setMessages((prevMessages) => [...prevMessages, userMessage, botMessagePlaceholder]);
    setQuery('');

    try {
      //const response = await fetch(`http://localhost:1104/generateResponse?userText=${query}`);
      const botText = await axios.get('http://localhost:1104/generateResponse', { params: { userText: query} });
      const botMessage = { text: botText.data, isUser: false };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const placeholderIndex = updatedMessages.findIndex((message) => message === botMessagePlaceholder);
        updatedMessages.splice(placeholderIndex, 1, botMessage);
        return updatedMessages;
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h1>Chat Application</h1>
      <div className="chatbox">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type a message"
        ></textarea>
        <input type="submit" value="Send" />
      </form>

    </div>
  );
}

export default App;
