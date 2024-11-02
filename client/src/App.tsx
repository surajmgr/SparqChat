import React from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DummyComponent from './components/DummyComponent';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notify = () => toast("Wow so easy!");

const Home = () => <div className="container p-6"><h1>Home Page</h1></div>;
const About = () => <div className="container p-6"><h1>About Page</h1></div>;

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dummy" element={<DummyComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
