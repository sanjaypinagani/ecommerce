import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Navbar.css';
import './Home';
import { useLogin } from "./context/LoginContext";
import { useCart } from "./context/CartContex";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Navbar() {
    const [login, setLogin] = useLogin();
    const [cart, ] = useCart();
    const navigate = useNavigate();
    
    const [searchTerm, setSearchTerm] = useState("");  // State to track the search input
    const [searchResults, setSearchResults] = useState([]); // Store search results

    // Handle search input changes
    const handleSearchInput = (e) => {
        setSearchTerm(e.target.value);
    };

    // Submit search form
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/items/search?query=${searchTerm}`);
            const res=await response.json()  // Adjust the API endpoint as needed
            setSearchResults(res); // Update search results based on API response
        } catch (error) {
            console.error("Search error:", error);
            toast.error("Search failed. Please try again.", { autoClose: 2000 });
        }
    };

    const Logout = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('/logout');
            if (response.status === 200) {
                setLogin(false);
                localStorage.removeItem('session');
                navigate('/');
                toast.success("Logged out successfully", { autoClose: 2000 });
            } else {
                console.log('An error occurred');
                toast.error("An error occurred", { autoClose: 2000 });
            }
        } catch (err) {
            console.log(err);
            toast.error('Internal server error', { autoClose: 2000 });
        }
    };

    return (
        <>
            <div className="navbar">
                <Link to="/">Home</Link>
                {!login && <Link to="login">Login</Link>}
                
                <div className="dropdown">Categories
                    <div className="dropdown-content">
                        <Link to="/">All</Link>
                        <Link to="/mobiles">Mobiles</Link>
                        <Link to="/Electronics">Electronics</Link>
                        <Link to="/clothing">Clothing</Link>
                        <Link to="/accessories">Accessories</Link>
                    </div>
                </div>

                {/* Search bar */}
                <form id="nav-form" onSubmit={handleSearchSubmit}>
                    <input
                        id="nav-input"
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchInput}
                    />
                    <button id="nav-button" type="submit">
                        <p>Search</p>
                    </button>
                </form>

                {/* Render search results */}
                {searchResults.length > 0 && (
                    <ul className="search-results">
                        {searchResults.map((item) => (
                            <li key={item.id}>
                                <Link to={`/product/${item.id}`}>{item.name}</Link>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="dropdown">
                    {login ? (
                        <img id="nav-img" src="https://logodix.com/logo/1984203.png" width="50px" height="50px" alt="User Logged In" />
                    ) : (
                        <Link id="nav-a" to="/login">
                            <img id="nav-img" src="https://logodix.com/logo/1984203.png" width="50px" height="50px" alt="Login" />
                        </Link>
                    )}
                    <div className="dropdown-content">
                        <Link to="/profile">My Profile</Link>
                        <Link to="/orders">Orders</Link>
                        {login && <button className="logout-button" type="submit" onClick={Logout}>Logout</button>}
                    </div>
                </div>

                <Link to="cart" className="cart-link">
                    Cart
                    {cart && cart.items && cart.items.length > 0 && (
                        <span className="cart-badge">{cart.items.length}</span>
                    )}
                </Link>
            </div>
        </>
    );
}

export default Navbar;
