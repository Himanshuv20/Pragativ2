import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Start with basic imports only
import { agriculturalTheme } from './theme/theme';

import './App.css';

function App() {
  return (
    <ThemeProvider theme={agriculturalTheme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <header style={{ padding: '20px', background: '#4CAF50', color: 'white' }}>
            <h1>🌾 Crop Calendar Application - Testing</h1>
          </header>
          <main style={{ padding: '20px' }}>
            <Routes>
              <Route path="/" element={
                <div>
                  <h2>Homepage Placeholder</h2>
                  <p>Basic React app with Material-UI theme is working!</p>
                  <p>Now testing component imports...</p>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
