import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

//Setting up axios
import axios from 'axios';

//import textarea
//import TextareaAutosize from 'react-textarea-autosize';


import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Array of sample prompts
  const samplePrompts = [
    // "How can I manage my income effectively as a college freshman?",
    "Work Opportunities",
    "Bank: 05/02/23",
    "What is the best way to budget $1000?"
  ];

  const handlePromptClick = (prompt) => {
    setQuery(prompt);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetch('/transactions.csv');
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value);
      const results = Papa.parse(csv, { header: true, dynamicTyping: true });
      const rows = results.data;
      setTransactions(rows);
    };

    fetchTransactions();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userMessage = { text: query, isUser: true };
    const botMessagePlaceholder = { text: '...', isUser: false };

    setMessages((prevMessages) => [...prevMessages, userMessage, botMessagePlaceholder]);
    setQuery('');

    try {
      let botText;

      if (query.toLowerCase().startsWith('bank:')) {
        const dateStr = query.slice(5).trim();
        const [month, day, year] = dateStr.split('/').map(Number);
        const date = new Date(year, month - 1, day); // month - 1 because months are 0-indexed in JavaScript Dates

        if (!isNaN(date)) {
          const dateTransactions = transactions.filter(transaction => {
            const [transactionMonth, transactionDay, transactionYear] = transaction.date.split('/').map(Number);
            const transactionDate = new Date(transactionYear, transactionMonth - 1, transactionDay);
            return transactionDate.getTime() === date.getTime(); // compare date times, not Date objects
          });

          if (dateTransactions.length > 0) {
            botText = dateTransactions.map(transaction =>
              transaction.type === 'Income'
                ? `You earned $${transaction.amount} from ${transaction.description}.`
                : `You spent $${transaction.amount} on ${transaction.description}.`
            ).join('\n');
          } else {
            botText = 'No transactions on the specified date.';
          }
        } else {
          botText = 'Invalid date. Please enter a date in the format MM/DD/YYYY.';
        }
      } else {
        const response = await axios.get('http://localhost:1104/generateResponse', { params: { userText: query } });
        botText = response.data;
      }

      const botMessage = { text: botText, isUser: false };
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
      <h1>FinBot</h1>
      <h3>Your AI Financial Assistant</h3>
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

      {/* Sample prompts */}
      <div className="sample-prompts">
        {samplePrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => handlePromptClick(prompt)}
            className="prompt-button"
          >
            {prompt}
          </button>
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
