import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Detection from './component/Detection';
import Upload from './component/Upload';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ToastContainer />
    <Routes>
      <Route path="detection" element={<Detection />} />
      <Route path="upload" element={<Upload />} />
    </Routes>
  </BrowserRouter>
);