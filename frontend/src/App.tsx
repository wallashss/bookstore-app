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
        <Route path="Test" element={<Tests />} />
      </Routes>
      
    </div>
  );
}

export default App;
