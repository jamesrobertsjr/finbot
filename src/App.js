import React, { useState } from 'react';

//Setting up axios
import axios from 'axios';

// importing other react components
import SuggestionTile from './SuggestionTile';

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

  const suggestionTiles = [
    'How did I spend my money last week?',
    'What is the best way to budget $1000?',
    'What did I spend on Thursday?',
    'Do you believe it is financially wise to spend my internship money or save it?'
    // TODO: Add more suggestion tiles here
  ];

  return (
    <div className="App">
      <div className='bg'>
        <div className='appHeader'>
          <h1 className='appTitle'>FinBot</h1>
          <h3 className='appSubTitle'>Your First Step towards Financial Independence</h3>
        </div>
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
        
        <div className="suggestion-container">
          <div className="suggestion-row">
            {suggestionTiles.map((suggestion, index) => (
              <SuggestionTile key={index} suggestion={suggestion} onClick={setQuery} />
            ))}
          </div>
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
    </div>
  );
}

export default App;
