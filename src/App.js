import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = event => {
    event.preventDefault();
    const userMessage = {text: query, isUser: true};
    const botMessage = {text: `You said: "${query}"`, isUser: false};
    setMessages([...messages, userMessage, botMessage]);
    setQuery('');
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
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type a message"
        />
        <input type="submit" value="Send" />
      </form>
    </div>
  );
}

export default App;
