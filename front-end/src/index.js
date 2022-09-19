import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css'
import App from './App';
import {
    BrowserRouter as Router,
} from "react-router-dom";
import {RecoilRoot} from 'recoil';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
      <Router>
          <RecoilRoot>
              <App />
          </RecoilRoot>
      </Router>
  // </React.StrictMode>
);
