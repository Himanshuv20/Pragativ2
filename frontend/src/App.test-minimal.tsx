import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#2E7D32' }}>🌾 Crop Calendar - Minimal Test</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ 
        background: 'white', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h2>Status Check</h2>
        <ul>
          <li>✅ HTML loaded</li>
          <li>✅ CSS loaded</li>
          <li>✅ JavaScript loaded</li>
          <li>✅ React mounted</li>
        </ul>
      </div>
      <button 
        onClick={() => alert('React is working!')}
        style={{
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Test React Interaction
      </button>
    </div>
  );
}

export default App;
