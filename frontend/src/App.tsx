import React from 'react';
import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar'
import Login from './pages/Login'
import Books from './pages/Books'
import Tests from './pages/Test'
import * as ReactDOM from "react-dom";
import { Routes, Route, Link } from "react-router-dom";
import CurrentRequest from './pages/CurrentRequest';
import Pdf from './pages/Pdf';
import Requests from './pages/Requests';
import PendingBooks from './pages/PendingBooks';
import { Box } from '@mui/material';
// App.js

const Home = () => {
  return (
    <>
    <NavBar ></NavBar>
    </>
  );
}

function App() {
  return (
    <div className="App">
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/books" element={<Books />} />
        <Route path="/pdf" element={<Pdf />} />
        <Route path="/current-request" element={<CurrentRequest />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/pending-books" element={<PendingBooks all={false} />} />
        <Route path="/all-pending-books" element={<PendingBooks all={true} />} />
        <Route path="Test" element={<Tests />} />
      </Routes>
      <Box sx={{mt: 4, mb: 4}}></Box>
    </div>
  );
}

export default App;
