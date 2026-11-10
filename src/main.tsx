import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './reference.css';
import './popups.css';
import './popup-runtime.css';
import './country-runtime.css';
import './runtime.css';

document.body.className = 'responsive';
createRoot(document.getElementById('root')!).render(<App />);
