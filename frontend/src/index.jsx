// frontend/src/index.jsx

import './index.css'; // <-- Tailwind CSS import
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // <-- CORRECTED EXTENSION

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// We are removing the reportWebVitals function and call since it is unnecessary