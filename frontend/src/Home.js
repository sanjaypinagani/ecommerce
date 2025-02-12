import React, { useState, useEffect } from 'react';
import './Home.css'; // Import CSS for styling
import { Link } from 'react-router-dom'; // Import Link from react-router-dom


const Home = () => {
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [priceRange, setPriceRange] = useState(5999);
  const [items, setItems] = useState([]);
  useEffect(() => {
    let updatedProducts = items;
    updatedProducts = updatedProducts.filter(
      (product) => product.price <= priceRange
    );

    setFilteredProducts(updatedProducts);
  }, [priceRange]);
  useEffect(()=>{
    const fetchItem = async () => {
      try {
        const response = await fetch('/items');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();
        setItems(json);
      } catch (error) {
        console.log(error)
      } }
      fetchItem();
  },[])

  return (
    <div className="home">
      {/* New Deals */}
      <div className="new-deals">
        <h2>New Deals</h2>
        <div className="deals-container">
          {items && items.map((items) => (
            <div key={items.id} className="deal-item">
              <Link to={`/products/${items._id}`}><img src={`${items.image}`} alt={items.name} />
              <p>{items.name}</p>
              <p>₹{items.price}</p></Link>
            </div>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="filter-section">
        <h2>Filter by Price</h2>
        <input
          type="range"
          min="5999"
          max="50000"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
        />
        <p>Price: Up to ₹{priceRange}</p>
      </div>

      {/* Product Listing */}
      <div className="product-list">
        <h2>Products</h2>
        <div className="product-grid">
          {filteredProducts && filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/products/${product._id}`}><img src={`${product.image}`} alt={product.name} />
              <h3>{product.name}</h3>
              <p>Category: {product.category}</p>
              <p>Price:  ₹{product.price}</p></Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
