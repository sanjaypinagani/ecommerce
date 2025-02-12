import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Mobiles from './pages/Mobiles';
import Navbar from './Navbar';
import ItemDetails from './ItemDetails';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignIn from './pages/signin';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Orders from './pages/orders';
import Home from './Home';
import Profile from './pages/profile';
import Electronics from './pages/Electronics'
import Cloths from './pages/Cloths';
import Accessories from './pages/Accessories';
function App() {
  return (
    <Router>
      <Navbar/>
      <ToastContainer/>
      <Routes>
        <Route path="/mobiles" element={<Mobiles />} />
        <Route path="/products/:id" element={<ItemDetails />} />
        <Route path="/accessories/:id" element={<ItemDetails />} />
        <Route path="/cloths/:id" element={<ItemDetails />} />
        <Route path="/electronics/:id" element={<ItemDetails />} />
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/orders' element={<Orders/>}/>
        <Route path='/electronics' element={<Electronics/>}/>
        <Route path='/clothing' element={<Cloths/>}/>
        <Route path='/accessories' element={<Accessories/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route exact path='/' element={<Home/>}/>
      </Routes>
    </Router>
  );
}

export default App;
