import React from 'react';

function SuggestionTile({ suggestion, onClick }) {
    return (
      <div className="suggestion-tile" onClick={() => onClick(suggestion)}>
        {suggestion}
      </div>
    );
}

export default SuggestionTile;