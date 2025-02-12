import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "./context/CartContex";

function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [off,setOff]=useState(0)
  const[cart,setCart]=useCart();
  
  useEffect(() => {
    if (id) {
      console.log(id)
      const fetchItem = async () => {
        try {
          const response = await fetch('/items/products/'+id);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const json = await response.json();
          setItem(json);
          if (json.beforePrice && json.price) {
            setOff(((json.beforePrice - json.price) / json.beforePrice) * 100)}
        } catch (error) {
          setError(error.message);
        }
      };
      fetchItem();
    } else {
      setError("Invalid item ID");
    }
  }, [id]);
  const addToCart=async(id)=>{
    try {
      console.log(id)
      const response=await fetch('/cart',{
        method:'POST',
        headers:{"Content-Type": "application/json" },
        body:JSON.stringify({id})
        })
      if(response.status===200){
        console.log(response.json());
        setCart((prevCart) => {
          console.log("Previous Cart State:", prevCart);
          if (prevCart.items){
            const itemExists = prevCart.items.some((item) => item.item._id === id);
            console.log("Item Exists:", itemExists);
  
            if (!itemExists) {
              const newCart = {
                ...prevCart,
                items: [...prevCart.items, { item: id, quantity: 1 }]
              };
            console.log("New Cart State:", newCart);
            return newCart;
            }
          }
          return prevCart;
        });
        }else if(response.status===401) {
         console.log(response.json());
         toast.warning('Please login first')
      }else{
        console.log(response.json());
        toast.error('Something went wrong')
      }
    }catch(err){
      console.log(err)
    }}
  return (
    <div className="itemDetails_container">
      {error && <h1>{error}</h1>}
      {!item && !error && <h1>Loading...</h1>}
      {item && (
        <div className='itemDetails'>
          <div className='itemDetails__image'>
            <img srcSet={item.image} alt={item.name}></img>
          </div>
          <div className='itemDetails__info'>
            <div className='itemDetails__description'>
              <h1>{item.name}</h1>
              <p>{item.description}</p>
            </div>
            <div className='itemDetails__price'>
              <p> ₹{item.price}</p>
              <p><span className='beforePrice'> ₹{item.beforePrice}</span>
              <span className='off'>{off.toFixed(0)}% off</span></p>
            </div>
          </div>
          <div className="itemDetails_cart">
            <button className="addtocart__button" onClick={() => {addToCart(id)}}
            >Add to Cart</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemDetails;
