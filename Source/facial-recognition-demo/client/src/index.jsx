import React from 'react';
import ReactDOM from 'react-dom/client';
import RootRouter from './RootRouter';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <RootRouter />
  // </React.StrictMode>
);