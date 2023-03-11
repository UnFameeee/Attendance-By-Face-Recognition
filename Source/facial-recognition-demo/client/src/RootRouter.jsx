import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Detection from './component/Detection';
import Upload from './component/Upload';

export default function RootRouter() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="detection" element={<Detection/>}/>
        <Route path="upload" element={<Upload/>}/>
      </Routes>
    </BrowserRouter>
  )
}
