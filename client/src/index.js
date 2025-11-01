// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import './App.css';

// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//   <MsalProvider instance={msalInstance}>
//     <App />
//   </MsalProvider>
// );
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
